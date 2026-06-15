from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from recommender import Recommender


app = FastAPI()

# =========================
# FIX CORS
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("⏳ Loading model...")
model = Recommender()
print("✅ Model ready!")

# =========================
# 🎵 HOME RECOMMEND
# =========================
@app.get("/recommend-content-base/home")
def recommend_home(limit: int = 20):
    seeds = model.df.sample(3)["track_id"].tolist()

    results = []

    for seed in seeds:
        results.extend(model.recommend(seed, top_k=10))

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
