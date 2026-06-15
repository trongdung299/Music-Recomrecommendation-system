import os
import json

import faiss
import torch
import numpy as np
from typing import List, Dict, Tuple
class FAISSRetriever:
    def __init__(self, embedding_dim: int = 128):
        self.embedding_dim = embedding_dim
        self.index: faiss.Index = None

    def search(self, query: torch.Tensor, k: int = 10, exclude_ids: List[int] = None) -> List[Tuple[int, float]]:
        q = query.cpu().numpy().astype(np.float32)
        if q.ndim == 1:
            q = q.reshape(1, -1)

        k_fetch = k + len(exclude_ids or []) + 10
        k_fetch = min(k_fetch, self.index.ntotal)

        scores, indices = self.index.search(q, k_fetch)
        exclude_set = set(exclude_ids or [])

        results = []
        for idx, score in zip(indices[0], scores[0]):
            if idx < 0 or idx in exclude_set:
                continue
            results.append((int(idx), float(score)))
            if len(results) >= k:
                break
        return results




