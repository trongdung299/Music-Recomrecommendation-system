import torch
import torch.nn as nn
import torch.nn.functional as F


class PointWiseFeedForward(nn.Module):
    """Position-wise Feed-Forward Network."""

    def __init__(self, hidden_size: int, dropout: float):
        super().__init__()
        self.fc1 = nn.Linear(hidden_size, hidden_size * 4)
        self.fc2 = nn.Linear(hidden_size * 4, hidden_size)
        self.dropout = nn.Dropout(dropout)
        self.gelu = nn.GELU()

    def forward(self, x):
        return self.fc2(self.dropout(self.gelu(self.fc1(x))))


class SASRecBlock(nn.Module):
    """Single Transformer block trong SASRec."""

    def __init__(self, hidden_size: int, num_heads: int, dropout: float):
        super().__init__()
        self.attention = nn.MultiheadAttention(
            embed_dim=hidden_size,
            num_heads=num_heads,
            dropout=dropout,
            batch_first=True,
        )
        self.ffn = PointWiseFeedForward(hidden_size, dropout)
        self.norm1 = nn.LayerNorm(hidden_size)
        self.norm2 = nn.LayerNorm(hidden_size)
        self.dropout = nn.Dropout(dropout)

    def forward(self, x, attn_mask=None, key_padding_mask=None):
        # Self-attention với residual
        residual = x
        x = self.norm1(x)
        attn_out, _ = self.attention(
            x,
            x,
            x,
            attn_mask=attn_mask,
            key_padding_mask=key_padding_mask,
            need_weights=False,
        )
        x = residual + self.dropout(attn_out)

        # FFN với residual
        residual = x
        x = self.norm2(x)
        x = residual + self.dropout(self.ffn(x))
        return x


class SASRec(nn.Module):
    """
    SASRec: Self-Attentive Sequential Recommendation.

    Paper: Wang-Cheng Kang, Julian McAuley. ICDM 2018.
    """

    def __init__(
        self,
        num_items: int,
        hidden_size: int,
        num_blocks: int,
        num_heads: int,
        max_seq_len: int,
        dropout: float,
    ):
        super().__init__()
        self.num_items = num_items
        self.hidden_size = hidden_size
        self.max_seq_len = max_seq_len

        # Item embedding (padding_idx=0)
        self.item_emb = nn.Embedding(num_items + 1, hidden_size, padding_idx=0)

        # Learnable positional embedding
        self.pos_emb = nn.Embedding(max_seq_len + 1, hidden_size)

        self.dropout = nn.Dropout(dropout)
        self.emb_norm = nn.LayerNorm(hidden_size)

        # Transformer blocks
        self.blocks = nn.ModuleList(
            [SASRecBlock(hidden_size, num_heads, dropout) for _ in range(num_blocks)]
        )

        self.final_norm = nn.LayerNorm(hidden_size)
        self._init_weights()

    def _init_weights(self):
        for module in self.modules():
            if isinstance(module, nn.Embedding):
                nn.init.normal_(module.weight, std=0.02)
            elif isinstance(module, nn.Linear):
                nn.init.xavier_uniform_(module.weight)
                if module.bias is not None:
                    nn.init.zeros_(module.bias)

    def get_sequence_embedding(self, input_ids: torch.Tensor) -> torch.Tensor:
        """
        Args:
            input_ids: (batch_size, seq_len)
        Returns:
            (batch_size, seq_len, hidden_size)
        """
        batch_size, seq_len = input_ids.shape

        item_embs = self.item_emb(input_ids)  # (B, L, H)

        positions = torch.arange(1, seq_len + 1, device=input_ids.device).unsqueeze(0)
        pos_embs = self.pos_emb(positions)  # (1, L, H)

        x = self.emb_norm(self.dropout(item_embs + pos_embs))

        # Causal mask – chỉ attend vào các vị trí trước
        causal_mask = torch.triu(
            torch.ones(seq_len, seq_len, device=input_ids.device) * float("-inf"),
            diagonal=1,
        )

        # Padding mask
        key_padding_mask = input_ids == 0  # True where padded

        for block in self.blocks:
            x = block(x, attn_mask=causal_mask, key_padding_mask=key_padding_mask)

        return self.final_norm(x)

    def forward(self, input_ids, pos_items, neg_items):
        """Training forward pass."""
        seq_emb = self.get_sequence_embedding(input_ids)

        pos_emb = self.item_emb(pos_items)
        neg_emb = self.item_emb(neg_items)

        pos_scores = (seq_emb * pos_emb).sum(-1)
        neg_scores = (seq_emb * neg_emb).sum(-1)

        return pos_scores, neg_scores

    def predict(self, input_ids: torch.Tensor, candidate_items: torch.Tensor) -> torch.Tensor:
        """
        Inference – tính score cho candidate items.

        Args:
            input_ids:       (batch_size, seq_len)
            candidate_items: (C,) hoặc (batch_size, C)
        Returns:
            (batch_size, C) scores
        """
        seq_emb = self.get_sequence_embedding(input_ids)  # (B, L, H)
        seq_emb = seq_emb[:, -1, :]  # Lấy last position (B, H)

        if candidate_items.dim() == 1:
            cand_emb = self.item_emb(candidate_items)  # (C, H)
            scores = seq_emb @ cand_emb.T  # (B, C)
        else:
            cand_emb = self.item_emb(candidate_items)  # (B, C, H)
            scores = (seq_emb.unsqueeze(1) * cand_emb).sum(-1)  # (B, C)

        return scores
