from typing import List, Optional
from pydantic import BaseModel


class SessionRecommendRequest(BaseModel):
    """Request body cho session-based recommendation."""
    track_ids: List[str]
    """Danh sách Spotify Track IDs theo thứ tự nghe (từ cũ đến mới nhất)."""
    top_k: int = 10
    """Số bài hát gợi ý, mặc định 10."""


class TrackRecommendation(BaseModel):
    """Một bài hát được gợi ý."""
    track_id: str
    track_name: Optional[str] = None
    artist_name: Optional[str] = None
    image: Optional[str] = None
    score: float


class SessionRecommendResponse(BaseModel):
    """Response trả về từ session-based recommendation endpoint."""
    model_name: str
    input_tracks: int
    """Số lượng tracks trong input sequence được sử dụng."""
    recommendations: List[TrackRecommendation]
