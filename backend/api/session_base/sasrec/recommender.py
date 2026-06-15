"""
SASRec Recommender – singleton loader và inference logic.
Model files cần đặt tại: model/session_base/sasrec/
"""

import json
import logging
import os
import pickle
from typing import Dict, List, Optional, Tuple

import torch
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session

from session_base.sasrec.model import SASRec

logger = logging.getLogger(__name__)

# --------------------------------------------------------
# Paths – tương đối so với thư mục chạy uvicorn (backend/api/)
# --------------------------------------------------------
MODEL_DIR = os.path.join(
    os.path.dirname(__file__),  # backend/api/session_base/sasrec/
    "../../../../model/session_base/sasrec",
)
MODEL_DIR = os.path.normpath(MODEL_DIR)

MODEL_WEIGHTS = os.path.join(MODEL_DIR, "sasrec_model.pt")
MODEL_CONFIG  = os.path.join(MODEL_DIR, "sasrec_config.json")
ITEM2ID_PATH  = os.path.join(MODEL_DIR, "item2id.pkl")
ID2ITEM_PATH  = os.path.join(MODEL_DIR, "id2item.pkl")


class SASRecRecommender:
    """
    Singleton class quản lý SASRec model.
    Load model một lần khi khởi động server.
    """

    _instance: Optional["SASRecRecommender"] = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
        self._initialized = True
        self._load_artifacts()

    def _load_artifacts(self):
        """Load model weights, config và item mappings."""
        logger.info(f"Loading SASRec artifacts from: {MODEL_DIR}")

        if not os.path.exists(MODEL_WEIGHTS):
            self._ready = False
            self.config = {}
            self.item2id = {}
            self.id2item = {}
            self.model = None
            self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
            logger.warning(
                f"Model file not found: {MODEL_WEIGHTS}. "
                "Train model bằng notebook 03 rồi đặt files vào model/session_base/sasrec/"
            )
            return

        # Load config
        with open(MODEL_CONFIG, "r") as f:
            self.config = json.load(f)
        logger.info(f"Loaded config: {self.config}")

        # Load item mappings
        with open(ITEM2ID_PATH, "rb") as f:
            self.item2id: Dict[str, int] = pickle.load(f)
        with open(ID2ITEM_PATH, "rb") as f:
            self.id2item: Dict[int, str] = pickle.load(f)

        logger.info(f"Item vocab size: {len(self.item2id):,}")

        # Device
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        logger.info(f"Using device: {self.device}")

        # Khởi tạo model
        self.model = SASRec(
            num_items=self.config["num_items"],
            hidden_size=self.config["hidden_size"],
            num_blocks=self.config["num_blocks"],
            num_heads=self.config["num_heads"],
            max_seq_len=self.config["max_seq_len"],
            dropout=0.0,  # Inference: tắt dropout
        ).to(self.device)

        # Load weights
        state_dict = torch.load(MODEL_WEIGHTS, map_location=self.device, weights_only=True)
        self.model.load_state_dict(state_dict)
        self.model.eval()

        self._ready = True
        logger.info("✅ SASRec model loaded successfully!")

    def is_ready(self) -> bool:
        """Kiểm tra model đã được load thành công chưa."""
        return getattr(self, '_ready', False)

    def get_model_info(self) -> dict:
        """Trả về thông tin model config và test metrics."""
        if not self.is_ready():
            return {
                "status": "not_loaded",
                "message": "Model chưa được train. Chạy notebook 03 và đặt files vào model/session_base/sasrec/",
                "model_dir": MODEL_DIR,
                "required_files": [
                    "sasrec_model.pt",
                    "sasrec_config.json",
                    "item2id.pkl",
                    "id2item.pkl",
                ],
            }
        return {
            "status": "loaded",
            "model_dir": MODEL_DIR,
            "device": str(self.device),
            "vocab_size": len(self.item2id),
            "config": self.config,
            "test_metrics": self.config.get("test_metrics", {}),
        }

    def recommend(
        self,
        track_ids: List[str],
        top_k: int = 10,
    ) -> Tuple[List[str], List[float], int]:
        """
        Gợi ý top-K bài hát tiếp theo dựa trên lịch sử nghe.

        Args:
            track_ids: Danh sách Spotify Track IDs theo thứ tự nghe (cũ → mới)
            top_k: Số bài cần gợi ý

        Returns:
            (recommended_track_ids, scores, num_valid_inputs)
        """
        if not self.is_ready():
            raise RuntimeError("Model chưa được load. Kiểm tra /recommend/session/sasrec/info để biết thêm.")

        max_seq_len = self.config["max_seq_len"]

        # Encode track_ids sang item indices, bỏ qua track không có trong vocab
        item_ids = []
        for tid in track_ids:
            if tid in self.item2id:
                item_ids.append(self.item2id[tid])

        num_valid = len(item_ids)
        if num_valid == 0:
            logger.warning("Không có track nào trong vocab của model")
            return [], [], 0

        # Truncate nếu quá dài (lấy các item gần nhất)
        item_ids = item_ids[-max_seq_len:]

        # Pad về max_seq_len
        pad_len = max_seq_len - len(item_ids)
        padded = [0] * pad_len + item_ids

        input_tensor = torch.LongTensor([padded]).to(self.device)  # (1, L)

        with torch.no_grad():
            # Score tất cả items (trừ padding=0)
            all_items = torch.arange(1, self.config["num_items"] + 1, device=self.device)
            scores = self.model.predict(input_tensor, all_items)  # (1, N)
            scores = scores[0].cpu().numpy()  # (N,)

        # Loại bỏ các items đã có trong input sequence
        input_set = set(item_ids)

        # Lấy top candidates
        candidate_items = []
        for idx in scores.argsort()[::-1]:
            item_id = idx + 1  # 1-indexed
            if item_id not in input_set:
                candidate_items.append((item_id, float(scores[idx])))
            if len(candidate_items) >= top_k:
                break

        # Convert về Spotify IDs
        recommended_ids = []
        recommended_scores = []
        for item_id, score in candidate_items:
            spotify_id = self.id2item.get(item_id)
            if spotify_id:
                recommended_ids.append(spotify_id)
                recommended_scores.append(score)

        return recommended_ids, recommended_scores, num_valid


# Singleton instance – được tạo khi import module này
_recommender: Optional[SASRecRecommender] = None


def get_recommender() -> SASRecRecommender:
    """Trả về singleton SASRecRecommender instance."""
    global _recommender
    if _recommender is None:
        _recommender = SASRecRecommender()
    return _recommender
