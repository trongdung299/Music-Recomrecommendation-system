import pymysql
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
from GRU.model import MusicRecommender, CustomUnpickler
from GRU.app import FAISSRetriever
from search.search_api import get_lyric_snippet, convert_ms_to_minutes, validate_image_url, remove_accents, \
    DEFAULT_MOCK_IMAGE
from content_base.latentspacerecommender import LatentSpaceRecommender
from sessionbase.sessionbase_recommender import get_recommend, buil_all_playlist
from collaborative_knowlege.script import recommend_artists
from typing import List
from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from dotenv import load_dotenv
import os
import pandas as pd
from content_base.recommender import Recommender
from sentence_transformers import SentenceTransformer
# Session-based recommendation (SASRec)
from session_base.sasrec.router import router as sasrec_router
import faiss
import numpy as np
import torch
origins = [
    "http://localhost:3000",
]

class UploadItem(BaseModel):
    user_id:int
    top_k : int
    interval:int
class ArtistRecommend(BaseModel):
    artist_id: str
    artist_name: str | None = None
    images: str | None = None
    score: float
class RecommendResponse(BaseModel):
    uid: int
    recommendations: List[ArtistRecommend]
app = FastAPI(
    title="MusicRS API",
    description="Music Recommendation System API",
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include SASRec session-based router
app.include_router(sasrec_router)
load_dotenv()
DB_HOST = os.getenv("host")
DB_USER = os.getenv("user")
DB_PASS = os.getenv("password")
DB_NAME = os.getenv("database")
engine = create_engine(URL.create(
    drivername="mysql+pymysql",
    username=DB_USER,
    password=DB_PASS,
    host=DB_HOST,
    port=3306,
    database=DB_NAME,
))
print("⏳ Loading model...")
c_model = Recommender()
print("Load Playlist")
lt_model=LatentSpaceRecommender('../../data/tracks.csv')
playlist_ids = [i for i in range(16, 1016)]
all_playlist=buil_all_playlist(playlist_ids)
print("✅ Model ready!")
##------search engine--------##
host=os.getenv('host')
user=os.getenv('user')
password=os.getenv('password')
database=os.getenv('database')
DB_CONFIG = {
    "host": host,
    "user": user,
    "password":password,
    "database": database,
    "port": 3306,
    "charset": "utf8mb4",
    "cursorclass": pymysql.cursors.DictCursor
}
# Thiết lập đường dẫn file dữ liệu gốc
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FAISS_PATH = "../../data/music_index.faiss"
METADATA_PATH ="../../data/music_metadata.pkl"
print("-> [1/4] Đang nạp mô hình Deep Learning Transformer (paraphrase-multilingual)...")
embedding_model = SentenceTransformer('sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')

print("-> [2/4] Đang nạp hệ thống Vector Index FAISS Lời nhạc...")
index = faiss.read_index(FAISS_PATH)

print("-> [3/4] Đang nạp cơ sở dữ liệu Metadata 51k bài...")
metadata_df = pd.read_pickle(METADATA_PATH)

print("-> [4/4] Đang tăng tốc tối ưu cấu trúc dữ liệu trên RAM...")
# Kỹ thuật Indexing RAM: Biến DataFrame thành Dictionary để tra cứu ID trong 0.00001 giây
metadata_dict = {}
for _, row in metadata_df.iterrows():
    m_id = str(row['id']).strip()
    metadata_dict[m_id] = {
        "track_name": str(row['track_name']).strip(),
        "artist_name": str(row['artist_name']).strip(),
        "clean_track_name": str(row.get('clean_track_name', '')),
        "clean_artist_name": str(row.get('clean_artist_name', '')),
        "lyric": str(row['lyric'])
    }
print(f"=== TẤT CẢ HỆ THỐNG ĐÃ KHỞI CHẠY VỚI TỐC ĐỘ CỰC HẠN ===")
class SongResult(BaseModel):
    track_id: str
    track_name: str
    artist_name: str
    duration: str
    track_image: str
    matched_lyric_snippet: str


####------------------------------GRU-------------------#######
# Biến toàn cục để lưu trữ trạng thái hệ thống
DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
SAVE_DIR = '../../model/saved_model'

model = None
processor = None
retriever = None
track_features = None










###----------------endpoint-----------------##
@app.post('/recommend/playlist')
async def create_upload_file(item: UploadItem):
    response = get_recommend(item.top_k,item.user_id,all_playlist,item.interval)
    return response
@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/recommend/{uid}", response_model=RecommendResponse)
def recommend(
    uid: int,
    top_k_users: int = 20,
    top_k_cases: int = 20,
    weight_case: float = 0.7,
    weight_user: float = 0.3,
):
    """
    Trả về danh sách artist được gợi ý cho user `uid`.

    - **top_k_users**: số lượng user tương tự dùng để tính điểm (default 20)
    - **top_k_cases**: số lượng case-based record dùng để tính điểm (default 20)
    - **weight_case**: trọng số cho case-based score (default 0.7)
    - **weight_user**: trọng số cho collaborative score (default 0.3)
    """
    # recs = recommend_artists(
    #     uid=uid,
    #     top_k_users=top_k_users,
    #     top_k_cases=top_k_cases,
    #     weight_case=weight_case,
    #     weight_user=weight_user,
    # )
    # return RecommendResponse(uid=uid, recommendations=[ArtistRecommend(**r) for r in recs])
    try:
        recs = recommend_artists(
            uid=uid,
            top_k_users=top_k_users,
            top_k_cases=top_k_cases,
            weight_case=weight_case,
            weight_user=weight_user,
        )
        return RecommendResponse(uid=uid, recommendations=[ArtistRecommend(**r) for r in recs])
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {e}")


# =========================
# 🎵 HOME RECOMMEND
# =========================
@app.get("/recommend-content-base/home")
def recommend_home(limit: int = 20,user_id:int=None):
    uh_query = f'''
            SELECT
        t.trackid AS track_id,
        t.track_name,
        ar.artist_name,
        t.genre,

        t.danceability,
        t.energy,
        t.loudness,
        t.speechiness,
        t.acousticness,
        t.instrumentalness,
        t.liveness,
        t.valence,
        t.tempo,
        t.duration_ms,
        t.year,t.image
    FROM Track t
    LEFT JOIN artisttrack at ON t.trackid = at.trackid
    LEFT JOIN artist ar ON at.artistid = ar.artistid
    INNER JOIN
    (select * from history where user_id={user_id} )  A on A.item_id=t.trackid
    order by datediff(now(),A.time) asc;
    '''
    uh_df=pd.read_sql(uh_query, engine)
    uh_df = uh_df.drop_duplicates(subset=["track_id"]).copy()
    seeds = uh_df["track_id"].tolist()

    results = []

    for seed in seeds:
        results.extend(c_model.recommend(seed, top_k=10))

    # remove duplicate
    seen = set()
    final = []

    for item in results:
        if item["track_id"] not in seen:
            seen.add(item["track_id"])
            final.append(item)

        if len(final) >= limit:
            break

    return final
@app.get("/recommend-content-base-vae/home")
def recommend_home(limit: int = 20,user_id:int=None):
    uh_query = f'''
            SELECT
        t.trackid AS track_id,
        t.track_name,
        ar.artist_name,
        t.genre,
        t.danceability,
        t.energy,
        t.loudness,
        t.speechiness,
        t.acousticness,
        t.instrumentalness,
        t.liveness,
        t.valence,
        t.tempo,
        t.duration_ms,
        t.year,t.image
    FROM Track t
    LEFT JOIN artisttrack at ON t.trackid = at.trackid
    LEFT JOIN artist ar ON at.artistid = ar.artistid
    INNER JOIN
    (select * from history where user_id={user_id} )  A on A.item_id=t.trackid
    order by datediff(now(),A.time) asc;
    '''
    uh_df=pd.read_sql(uh_query, engine)
    uh_df = uh_df.drop_duplicates(subset=["track_id"]).copy()
    seeds =list(uh_df['track_id'])
    results = []
    for seed in seeds:
        results.extend(lt_model.recommend(seed, top_k=10))
    # remove duplicate
    seen = set()
    final = []

    for item in results:
        if item["track_id"] not in seen:
            seen.add(item["track_id"])
            final.append(item)

        if len(final) >= limit:
            break

    return final

###--------------------------------Search--------------------------###
@app.get("/backend/api/search", response_model=List[SongResult])
async def search_songs(
        query: str = Query(..., description="Nhập từ khóa tìm kiếm"),
        search_type: str = Query("all", description="Chế độ bộ lọc: all, name, lyric")
):
    query = query.strip()
    if not query:
        return []

    final_results = []
    seen_songs_keys = set()

    # =========================================================================
    # CHẾ ĐỘ 1: TÌM THEO TÊN BÀI / CA SĨ -> QUÉT KHÔNG GIAN PHÂN TÁCH TRÊN MYSQL
    # =========================================================================
    if search_type == "name":
        try:
            connection = pymysql.connect(**DB_CONFIG)
            with connection.cursor() as cursor:
                search_param = f"%{query}%"

                # Quét nhanh theo tên bài hát trước
                sql_track = "SELECT trackid, track_name, duration_ms, image FROM track WHERE track_name LIKE %s LIMIT 15"
                cursor.execute(sql_track, (search_param,))
                tracks_found = cursor.fetchall()

                # Quét theo ca sĩ nếu chưa đủ kết quả
                artists_tracks_found = []
                if len(tracks_found) < 15:
                    limit_remain = 15 - len(tracks_found)
                    sql_artist = """
                        SELECT t.trackid, t.track_name, t.duration_ms, t.image
                        FROM artist a
                        INNER JOIN artisttrack at ON a.artistid = at.artistid
                        INNER JOIN track t ON at.trackid = t.trackid
                        WHERE a.artist_name LIKE %s LIMIT %s
                    """
                    cursor.execute(sql_artist, (search_param, limit_remain))
                    artists_tracks_found = cursor.fetchall()

                all_raw_tracks = list(tracks_found) + list(artists_tracks_found)
                if not all_raw_tracks:
                    return []

                target_ids = [str(r['trackid']).strip() for r in all_raw_tracks]
                format_strings = ','.join(['%s'] * len(target_ids))

                # Lấy tên ca sĩ tương ứng
                sql_get_artists = f"""
                    SELECT at.trackid, a.artist_name FROM artisttrack at
                    INNER JOIN artist a ON at.artistid = a.artistid WHERE at.trackid IN ({format_strings})
                """
                cursor.execute(sql_get_artists, tuple(target_ids))
                artist_rows = cursor.fetchall()

                artist_map = {}
                for r in artist_rows:
                    tid = str(r['trackid']).strip()
                    if tid not in artist_map: artist_map[tid] = []
                    artist_map[tid].append(str(r['artist_name']))

                for r in all_raw_tracks:
                    t_id = str(r['trackid']).strip()
                    t_name = str(r['track_name']).strip()
                    a_name = ", ".join(artist_map.get(t_id, ["Chưa rõ ca sĩ"]))
                    song_key = f"{t_name}_{a_name}".lower()

                    if song_key in seen_songs_keys: continue
                    seen_songs_keys.add(song_key)

                    # Tra nhanh lyric trên RAM Dictionary (Tốc độ tối đa)
                    matched_lyric = "Bài hát nằm ngoài danh mục 51k bài (Không có sẵn lyric văn bản)."
                    if t_id in metadata_dict:
                        matched_lyric = get_lyric_snippet(metadata_dict[t_id]['lyric'], query)

                    final_results.append({
                        "track_id": t_id,
                        "track_name": t_name,
                        "artist_name": a_name,
                        "duration": convert_ms_to_minutes(r['duration_ms']),
                        "track_image": validate_image_url(r['image']),
                        "matched_lyric_snippet": matched_lyric
                    })
            return final_results[:10]
        except Exception as e:
            print(f"⚠️ Lỗi MySQL: {e}")
            return []
        finally:
            if 'connection' in locals() and connection.open: connection.close()

    # =========================================================================
    # CHẾ ĐỘ 2 & 3: TÌM KIẾM "LYRIC" HOẶC "TẤT CẢ" (LAI) -> TRA CỨU SIÊU TỐC TRÊN RAM
    # =========================================================================
    else:
        query_clean = remove_accents(query)
        total_songs = len(metadata_df)
        scores = np.zeros(total_songs)

        # Bắn mô hình AI lập chỉ mục FAISS
        query_vector = embedding_model.encode([query], convert_to_numpy=True)
        faiss.normalize_L2(query_vector)

        top_k_semantic = min(100, total_songs)
        semantic_distances, semantic_indices = index.search(query_vector, top_k_semantic)

        for sim_score, idx in zip(semantic_distances[0], semantic_indices[0]):
            if idx != -1 and idx < total_songs:
                scores[idx] += sim_score * (0.6 if search_type == "all" else 1.0)

        # Trích xuất điểm lai từ khóa nếu chọn 'Tất cả'
        if search_type == "all":
            name_exact_mask = (metadata_df['track_name'].str.lower() == query.lower()) | (
                        metadata_df['clean_track_name'] == query_clean)
            scores[name_exact_mask] += 1.5
            name_contain_mask = metadata_df['track_name'].str.contains(query, na=False, case=False) | metadata_df[
                'clean_track_name'].str.contains(query_clean, na=False, case=False)
            scores[name_contain_mask] += 0.8
            artist_mask = metadata_df['artist_name'].str.contains(query, na=False, case=False) | metadata_df[
                'clean_artist_name'].str.contains(query_clean, na=False, case=False)
            scores[artist_mask] += 0.7

        best_indices = np.argsort(scores)[::-1]
        temp_results = []
        track_ids_to_fetch = []

        for idx in best_indices:
            if scores[idx] <= 0: break

            row = metadata_df.iloc[idx]
            t_name = str(row['track_name']).strip()
            a_name = str(row['artist_name']).strip()
            song_key = f"{t_name}_{a_name}".lower()

            if song_key in seen_songs_keys: continue
            seen_songs_keys.add(song_key)

            t_id = str(row['id']).strip()
            temp_results.append({
                "track_id": t_id,
                "track_name": t_name,
                "artist_name": a_name,
                "matched_lyric_snippet": get_lyric_snippet(row['lyric'], query)
            })
            track_ids_to_fetch.append(t_id)
            if len(temp_results) >= 10: break

        if not temp_results: return []

        # Đồng bộ nhanh duration và image từ MySQL sang cho cụm bài tìm thấy
        try:
            connection = pymysql.connect(**DB_CONFIG)
            with connection.cursor() as cursor:
                format_strings = ','.join(['%s'] * len(track_ids_to_fetch))
                sql_query_id = f"""
                    SELECT t.trackid, t.duration_ms, t.image, a.artist_name 
                    FROM track t LEFT JOIN artisttrack at ON t.trackid = at.trackid
                    LEFT JOIN artist a ON at.artistid = a.artistid WHERE t.trackid IN ({format_strings})
                """
                cursor.execute(sql_query_id, tuple(track_ids_to_fetch))
                rows_id = cursor.fetchall()
                mysql_data = {str(r['trackid']).strip(): r for r in rows_id}

                for song in temp_results:
                    t_id = song["track_id"]
                    db_row = mysql_data.get(t_id)

                    duration = convert_ms_to_minutes(db_row['duration_ms']) if db_row else "3:45"
                    image = validate_image_url(db_row['image'] if db_row else None)
                    artist = str(db_row['artist_name']) if db_row and db_row['artist_name'] else song["artist_name"]

                    final_results.append({
                        "track_id": t_id,
                        "track_name": song["track_name"],
                        "artist_name": artist,
                        "duration": duration,
                        "track_image": image,
                        "matched_lyric_snippet": song["matched_lyric_snippet"]
                    })
        except Exception as e:
            print(f"⚠️ Lỗi MySQL Luồng AI: {e}")
            for song in temp_results:
                final_results.append({
                    "track_id": song["track_id"],
                    "track_name": song["track_name"],
                    "artist_name": song["artist_name"],
                    "duration": "3:45",
                    "track_image": DEFAULT_MOCK_IMAGE,
                    "matched_lyric_snippet": song["matched_lyric_snippet"]
                })
        finally:
            if 'connection' in locals() and connection.open: connection.close()
        return final_results


###-------------------------GRU----------------------------------###
@app.on_event("startup")
async def load_artifacts():
    global gru_model, processor, retriever, track_features

    print(f"[*] Loading models to {DEVICE}...")
    try:
        # 1. Load Cấu hình
        with open(f'{SAVE_DIR}/model_config.json') as f:
            cfg = json.load(f)

        # 2. Khởi tạo & Load weights model
        gru_model = MusicRecommender(
            feature_dim=cfg['feature_dim'],
            embedding_dim=cfg['embedding_dim'],
            temperature=cfg['temperature'],
        ).to(DEVICE)
        gru_model.load_state_dict(torch.load(f'{SAVE_DIR}/model.pt', map_location=DEVICE))
        gru_model.eval()

        # 3. Load DataProcessor
        # 3. Load DataProcessor (Đã sửa bằng CustomUnpickler)
        with open(f'{SAVE_DIR}/processor.pkl', 'rb') as f:
            processor = CustomUnpickler(f).load()

        # 4. Load Track Features
        track_features = torch.load(f'{SAVE_DIR}/track_features.pt', map_location='cpu')

        # 5. Khởi tạo & Load FAISS Index
        retriever = FAISSRetriever(cfg['embedding_dim'])
        retriever.index = faiss.read_index(f'{SAVE_DIR}/faiss.index')

        print(f"[*] Load thành công! Hệ thống sẵn sàng (Tracks: {processor.num_tracks}).")
    except Exception as e:
        print(f"[!] Lỗi khi load artifacts: {str(e)}")
        raise e


# =====================================================================
# 3. KHAI BÁO SCHEMAS & ENDPOINTS
# =====================================================================

class RecommendRequest(BaseModel):
    history_track_ids: List[str]  # Mảng các track_id dạng string mà user đã nghe
    top_k: int = 10  # Số lượng bài muốn gợi ý (mặc định 10)


class TrackInfo(BaseModel):
    rank: int
    score: float
    track_title: str
    artist: str
    genre: str
    year: int
    popularity: int
    track_id: str


class RecommendResponse(BaseModel):
    status: str
    message: str
    recommendations: List[TrackInfo]


@app.post("/recommend", response_model=RecommendResponse)
async def get_recommendations(req: RecommendRequest):
    if not req.history_track_ids:
        raise HTTPException(status_code=400, detail="Lịch sử nghe không được để trống.")

    # 1. Map chuỗi track_id sang integer index
    history_idxs = processor.encode_track_ids(req.history_track_ids)

    if not history_idxs:
        # Nếu toàn bộ ID user gửi không có trong hệ thống
        raise HTTPException(
            status_code=404,
            detail="Không tìm thấy các bài hát này trong hệ thống để làm cơ sở gợi ý (Cold-start triệt để)."
        )

    # 2. Encode User Profile từ lịch sử
    # Đưa track_features lên DEVICE khi suy luận
    user_emb = gru_model.encode_user_from_history(history_idxs, track_features.to(DEVICE))

    # 3. Search qua FAISS
    results = retriever.search(user_emb.squeeze(0), k=req.top_k, exclude_ids=history_idxs)

    # 4. Map index kết quả ngược lại thành thông tin chi tiết
    recs = []
    for rank, (idx, score) in enumerate(results, 1):
        meta = processor.get_meta(idx)
        recs.append(TrackInfo(
            rank=rank,
            score=round(score, 4),
            track_title=meta['track_title'],
            artist=meta['artist_name'],
            genre=meta['genre'],
            year=meta['year'],
            popularity=meta['popularity'],
            track_id=meta['track_id'],
        ))

    return RecommendResponse(
        status="success",
        message=f"Đã tạo gợi ý dựa trên {len(history_idxs)} bài hát hợp lệ từ lịch sử.",
        recommendations=recs
    )


# uvicorn app:app --host 0.0.0.0 --port 8000 --reload
@app.get("/")
async def root():
    return {"message": "Music Recommendation API is running. Truy cập /docs để xem Swagger UI."}
