"""
FastAPI Router cho SASRec session-based recommendation.

Endpoints:
  POST /recommend/session/sasrec/           – Recommend từ danh sách track_ids
  GET  /recommend/session/sasrec/health     – Kiểm tra model status
  GET  /recommend/session/sasrec/info       – Xem model config + test metrics
  GET  /recommend/session/sasrec/user/{uid} – Recommend từ lịch sử nghe trong DB
"""

import logging
import os

import pandas as pd
from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy import create_engine, text
from sqlalchemy.engine import URL
from dotenv import load_dotenv

from session_base.schemas import (
    SessionRecommendRequest,
    SessionRecommendResponse,
    TrackRecommendation,
)
from session_base.sasrec.recommender import SASRecRecommender, get_recommender

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/recommend/session/sasrec",
    tags=["session-based"],
)

# --------------------------------------------------------
# DB engine – lazy init khi router được load
# --------------------------------------------------------
load_dotenv()


def _get_engine():
    return create_engine(URL.create(
        drivername="mysql+pymysql",
        username=os.getenv("user", "root"),
        password=os.getenv("password", ""),
        host=os.getenv("host", "localhost"),
        port=3306,
        database=os.getenv("database", "musicrs"),
    ))


_engine = None


def get_engine():
    global _engine
    if _engine is None:
        _engine = _get_engine()
    return _engine


# --------------------------------------------------------
# Helper: lấy metadata track từ DB
# --------------------------------------------------------
def fetch_track_metadata(track_ids: list, engine) -> dict:
    """
    Lấy track_name, artist_name, image từ MySQL cho danh sách track IDs.
    Returns: {track_id: {track_name, artist_name, image}}
    """
    if not track_ids:
        return {}

    placeholders = ", ".join([f"'{tid}'" for tid in track_ids])
    query = f"""
        SELECT
            t.trackid    AS track_id,
            t.track_name,
            ar.artist_name,
            t.image
        FROM Track t
        LEFT JOIN artisttrack at2 ON at2.trackid = t.trackid
        LEFT JOIN artist ar ON ar.artistid = at2.artistid
        WHERE t.trackid IN ({placeholders})
        GROUP BY t.trackid, t.track_name, ar.artist_name, t.image
    """
    try:
        df = pd.read_sql(query, engine)
        metadata = {}
        for _, row in df.iterrows():
            metadata[row["track_id"]] = {
                "track_name":  row.get("track_name"),
                "artist_name": row.get("artist_name"),
                "image":       row.get("image"),
            }
        return metadata
    except Exception as e:
        logger.warning(f"DB query failed: {e}")
        return {}


def fetch_user_history(user_id: int, engine, limit: int = 50) -> list:
    """
    Lấy lịch sử nghe nhạc của user từ DB, sắp xếp theo thứ tự thời gian (cũ → mới).
    Returns: list of spotify track_ids
    """
    query = f"""
        SELECT item_id, time
        FROM history
        WHERE user_id = {user_id}
        ORDER BY time ASC
        LIMIT {limit}
    """
    try:
        df = pd.read_sql(query, engine)
        if df.empty:
            return []
        return df["item_id"].dropna().tolist()
    except Exception as e:
        logger.warning(f"DB history query failed for user {user_id}: {e}")
        return []


# --------------------------------------------------------
# Endpoint 1: Health check
# --------------------------------------------------------
@router.get(
    "/health",
    summary="SASRec Model Health Check",
    description="Kiểm tra trạng thái model SASRec (đã load chưa).",
)
def health_check(
    recommender: SASRecRecommender = Depends(get_recommender),
):
    if recommender.is_ready():
        return {
            "status": "ok",
            "model": "SASRec",
            "vocab_size": len(recommender.item2id),
        }
    return {
        "status": "model_not_loaded",
        "message": "Model chưa được train. Xem /recommend/session/sasrec/info để biết cách setup.",
    }


# --------------------------------------------------------
# Endpoint 2: Model info + test metrics
# --------------------------------------------------------
@router.get(
    "/info",
    summary="SASRec Model Info",
    description="Xem thông tin model config, vocab size và kết quả kiểm thử trên test set.",
)
def model_info(
    recommender: SASRecRecommender = Depends(get_recommender),
):
    return recommender.get_model_info()


# --------------------------------------------------------
# Endpoint 3: Recommend từ danh sách track_ids
# --------------------------------------------------------
@router.post(
    "/",
    response_model=SessionRecommendResponse,
    summary="SASRec Session-Based Recommendation",
    description="""
Gợi ý bài hát tiếp theo dựa trên lịch sử nghe nhạc của người dùng.

- **track_ids**: Danh sách Spotify Track ID theo thứ tự nghe từ cũ đến mới nhất (tối đa 50)
- **top_k**: Số bài hát gợi ý (mặc định 10)

Model sử dụng: **SASRec** (Self-Attentive Sequential Recommendation)
    """,
)
async def recommend_sasrec(
    request: SessionRecommendRequest,
    recommender: SASRecRecommender = Depends(get_recommender),
):
    # Validation
    if not request.track_ids:
        raise HTTPException(status_code=400, detail="track_ids không được để trống")

    if request.top_k < 1 or request.top_k > 100:
        raise HTTPException(status_code=400, detail="top_k phải trong khoảng [1, 100]")

    if not recommender.is_ready():
        raise HTTPException(
            status_code=503,
            detail="Model chưa được load. Hãy train model và đặt files vào model/session_base/sasrec/",
        )

    # Gọi model
    try:
        recommended_ids, scores, num_valid = recommender.recommend(
            track_ids=request.track_ids,
            top_k=request.top_k,
        )
    except Exception as e:
        logger.error(f"Model inference error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Model error: {str(e)}")

    if num_valid == 0:
        raise HTTPException(
            status_code=422,
            detail=(
                "Không tìm thấy track nào trong vocabulary của model. "
                "Hãy đảm bảo track_ids là Spotify IDs hợp lệ từ NowPlaying dataset."
            ),
        )

    # Lấy metadata từ DB
    try:
        engine = get_engine()
        metadata = fetch_track_metadata(recommended_ids, engine)
    except Exception as e:
        logger.warning(f"Không thể lấy metadata từ DB: {e}")
        metadata = {}

    # Build response
    recommendations = _build_recommendations(recommended_ids, scores, metadata)

    return SessionRecommendResponse(
        model_name="SASRec",
        input_tracks=num_valid,
        recommendations=recommendations,
    )


# --------------------------------------------------------
# Endpoint 4: Recommend từ user_id (lấy lịch sử từ DB)
# --------------------------------------------------------
@router.get(
    "/user/{user_id}",
    response_model=SessionRecommendResponse,
    summary="SASRec Recommendation from User History",
    description="""
Tự động lấy lịch sử nghe nhạc của user từ database rồi gợi ý bài tiếp theo.

- **user_id**: ID người dùng trong hệ thống
- **top_k**: Số bài hát gợi ý (query param, mặc định 10)
- **history_limit**: Số bài gần nhất trong lịch sử dùng làm context (mặc định 50)
    """,
)
async def recommend_sasrec_user(
    user_id: int = Path(..., description="User ID trong hệ thống"),
    top_k: int = 10,
    history_limit: int = 50,
    recommender: SASRecRecommender = Depends(get_recommender),
):
    if not recommender.is_ready():
        raise HTTPException(
            status_code=503,
            detail="Model chưa được load. Hãy train model và đặt files vào model/session_base/sasrec/",
        )

    if top_k < 1 or top_k > 100:
        raise HTTPException(status_code=400, detail="top_k phải trong khoảng [1, 100]")

    # Lấy lịch sử từ DB
    try:
        engine = get_engine()
        track_ids = fetch_user_history(user_id, engine, limit=history_limit)
    except Exception as e:
        logger.error(f"DB error fetching history for user {user_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Không thể lấy lịch sử nghe: {str(e)}")

    if not track_ids:
        raise HTTPException(
            status_code=404,
            detail=f"Không tìm thấy lịch sử nghe nhạc cho user_id={user_id}",
        )

    # Gọi model
    try:
        recommended_ids, scores, num_valid = recommender.recommend(
            track_ids=[str(tid) for tid in track_ids],
            top_k=top_k,
        )
    except Exception as e:
        logger.error(f"Model inference error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Model error: {str(e)}")

    if num_valid == 0:
        raise HTTPException(
            status_code=422,
            detail=(
                f"Lịch sử nghe của user {user_id} ({len(track_ids)} tracks) "
                "không có track nào trong vocabulary của model SASRec."
            ),
        )

    # Lấy metadata
    try:
        metadata = fetch_track_metadata(recommended_ids, engine)
    except Exception as e:
        logger.warning(f"Không thể lấy metadata: {e}")
        metadata = {}

    recommendations = _build_recommendations(recommended_ids, scores, metadata)

    return SessionRecommendResponse(
        model_name="SASRec",
        input_tracks=num_valid,
        recommendations=recommendations,
    )


# --------------------------------------------------------
# Helper
# --------------------------------------------------------
def _build_recommendations(
    track_ids: list,
    scores: list,
    metadata: dict,
) -> list:
    recommendations = []
    for track_id, score in zip(track_ids, scores):
        meta = metadata.get(track_id, {})
        recommendations.append(
            TrackRecommendation(
                track_id=track_id,
                track_name=meta.get("track_name"),
                artist_name=meta.get("artist_name"),
                image=meta.get("image"),
                score=round(score, 6),
            )
        )
    return recommendations
