# SASRec Model Files

Thư mục này chứa các file model SASRec sau khi training.

## Cách lấy files

1. Chạy notebook `session_base/data_pipeline/03_build_sequences_and_train.ipynb` trên Google Colab/Kaggle
2. Download file `sasrec_export.zip` từ output của notebook
3. Giải nén và copy vào thư mục này

## Files cần có

```
model/session_base/sasrec/
├── sasrec_model.pt        # PyTorch model weights (best checkpoint)
├── sasrec_config.json     # Hyperparameters và model config
├── item2id.pkl            # Mapping: spotify_track_id → integer index
└── id2item.pkl            # Mapping: integer index → spotify_track_id
```

## sasrec_config.json format

```json
{
  "max_seq_len": 50,
  "hidden_size": 128,
  "num_blocks": 2,
  "num_heads": 2,
  "dropout": 0.2,
  "num_items": 12345,
  "test_metrics": {
    "Hit@5": 0.1234,
    "Hit@10": 0.1567,
    "NDCG@5": 0.0890,
    "NDCG@10": 0.1023,
    "MRR": 0.0912
  }
}
```

## API Endpoint

```bash
POST http://localhost:8000/recommend/session/sasrec

Body:
{
  "track_ids": ["4uLU6hMCjMI75M1A2tKUQC", "6rqhFgbbKwnb9MLmUQDhG6"],
  "top_k": 10
}
```
