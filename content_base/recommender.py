import pandas as pd
import numpy as np
from sqlalchemy import create_engine
from dotenv import load_dotenv
import os

from sklearn.preprocessing import StandardScaler
from sklearn.feature_extraction.text import TfidfVectorizer
from scipy.sparse import hstack
import faiss

load_dotenv()
DB_HOST = os.getenv("host")
DB_USER = os.getenv("user")
DB_PASS = os.getenv("password")
DB_NAME = os.getenv("database")

class Recommender:
    def __init__(self):
        # =========================
        #  CONFIG MYSQL 
        # =========================
        self.engine = create_engine(
    f"mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}:3306/{DB_NAME}"
)

        # =========================
        #  LOAD DATA
        # =========================
        query = """
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
"""
        self.df = pd.read_sql(query, self.engine)
        print("Loaded:", len(self.df), "tracks")

        # =========================
        # CLEAN DATA
        # =========================

        self.df = self.df.drop_duplicates(subset=["track_id"]).copy()

        self.df["artist_name"] = self.df["artist_name"].fillna("Unknown")
        self.df["genre"] = self.df["genre"].fillna("Unknown")
        self.df["track_name"] = self.df["track_name"].fillna("")

        num_cols = [
            "danceability","energy","loudness","speechiness",
            "acousticness","instrumentalness","liveness",
            "valence","tempo","duration_ms","year"
        ]

        for col in num_cols:
            self.df[col] = pd.to_numeric(self.df[col], errors="coerce")
            self.df[col] = self.df[col].fillna(self.df[col].median())

        # =========================
        # VECTORIZE
        # =========================
        X_audio = StandardScaler().fit_transform(self.df[num_cols])
        X_text = TfidfVectorizer().fit_transform(self.df["genre"])

        X = hstack([X_audio, X_text]).toarray().astype("float32")

        faiss.normalize_L2(X)

        self.index = faiss.IndexFlatIP(X.shape[1])
        self.index.add(X)

        self.X = X

        # mapping track_id → index
        self.track_index = {
            self.df.iloc[i]["track_id"]: i for i in range(len(self.df))
        }

    # =========================
    # RECOMMEND FUNCTION
    # =========================
    def recommend(self, track_id, top_k=10):
        if track_id not in self.track_index:
            return []

        i = self.track_index[track_id]

        distances, indices = self.index.search(
            self.X[i].reshape(1, -1), top_k + 5
        )

        results = []

        for j in indices[0][1:]:
            row = self.df.iloc[j]

            results.append({
                "track_id": row["track_id"],
                "track_name": row["track_name"],
                'duration_ms':row['duration_ms'],
                "t_name": row["artist_name"],
                "image":row['image']
            })

            if len(results) >= top_k:
                break

        return results