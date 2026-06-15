import torch
import pickle
import torch.nn as nn
import torch.nn.functional as F
from sklearn.preprocessing import LabelEncoder, StandardScaler
from typing import List, Dict
# =====================================================================
# 1. ĐỊNH NGHĨA LẠI CÁC CLASS (Bắt buộc để load pickle & weights)
# =====================================================================
AUDIO_FEATURES = [
    'danceability', 'energy', 'loudness', 'speechiness',
    'acousticness', 'instrumentalness', 'liveness', 'valence',
    'tempo', 'duration_ms',
]


class CustomUnpickler(pickle.Unpickler):
    def find_class(self, module, name):
        if module == '__main__' and name == 'DataProcessor':
            return DataProcessor
        return super().find_class(module, name)


class DataProcessor:
    def __init__(self):
        self.genre_encoder = LabelEncoder()
        self.audio_scaler = StandardScaler()
        self.track_encoder = LabelEncoder()
        self.user_encoder = LabelEncoder()
        self.track_meta: Dict[int, dict] = {}
        self.track2idx: Dict[str, int] = {}
        self.is_fitted = False

    def encode_track_ids(self, track_ids: List[str]) -> List[int]:
        return [self.track2idx[t] for t in track_ids if t in self.track2idx]

    def get_meta(self, idx: int) -> dict:
        return self.track_meta.get(idx, {
            'track_id': 'unknown', 'track_title': 'Unknown',
            'artist_name': 'Unknown', 'genre': '',
            'year': 0, 'popularity': 0,
        })

    @property
    def num_tracks(self):  return len(self.track_encoder.classes_)

    @property
    def num_users(self):   return len(self.user_encoder.classes_)

    @property
    def feature_dim(self): return len(AUDIO_FEATURES) + 3


class ItemEncoder(nn.Module):
    def __init__(self, feature_dim: int, embedding_dim: int = 128):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(feature_dim, 256),
            nn.LayerNorm(256),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(256, 256),
            nn.LayerNorm(256),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(256, embedding_dim),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return F.normalize(self.net(x), dim=-1)


class GRUUserEncoder(nn.Module):
    def __init__(self, embedding_dim: int = 128, hidden_dim: int = 256, num_layers: int = 2, dropout: float = 0.2):
        super().__init__()
        self.gru = nn.GRU(
            input_size=embedding_dim, hidden_size=hidden_dim, num_layers=num_layers,
            batch_first=True, dropout=dropout if num_layers > 1 else 0.0,
        )
        self.proj = nn.Sequential(
            nn.Linear(hidden_dim, embedding_dim),
            nn.LayerNorm(embedding_dim),
        )

    def forward(self, seq: torch.Tensor, lengths: torch.Tensor) -> torch.Tensor:
        packed = nn.utils.rnn.pack_padded_sequence(seq, lengths.cpu(), batch_first=True, enforce_sorted=False)
        _, hidden = self.gru(packed)
        last_hidden = hidden[-1]
        return F.normalize(self.proj(last_hidden), dim=-1)


class InfoNCELoss(nn.Module):
    def __init__(self, temperature: float = 0.07):
        super().__init__()
        self.temperature = temperature

    def forward(self, user_emb: torch.Tensor, pos_track_emb: torch.Tensor) -> torch.Tensor:
        batch_size = user_emb.size(0)
        sim = torch.matmul(user_emb, pos_track_emb.T) / self.temperature
        labels = torch.arange(batch_size, device=user_emb.device)
        return F.cross_entropy(sim, labels)


class MusicRecommender(nn.Module):
    def __init__(self, feature_dim: int, embedding_dim: int = 128, temperature: float = 0.07):
        super().__init__()
        self.item_encoder = ItemEncoder(feature_dim, embedding_dim)
        self.user_encoder = GRUUserEncoder(embedding_dim)
        self.loss_fn = InfoNCELoss(temperature)
        self.embedding_dim = embedding_dim

    @torch.no_grad()
    def encode_user_from_history(self, history_idxs: List[int], track_features: torch.Tensor) -> torch.Tensor:
        self.eval()
        history_idxs = history_idxs[-20:]  # Giới hạn 20 bài gần nhất
        hist_feats = track_features[history_idxs]
        hist_embs = self.item_encoder(hist_feats)
        seq = hist_embs.unsqueeze(0)
        length = torch.tensor([hist_embs.size(0)])
        return self.user_encoder(seq, length)