import os
import numpy as np
import pandas as pd
from collections import defaultdict
from typing import List, Tuple

import mysql.connector
from dotenv import load_dotenv

# ── Load env ──────────────────────────────────────────────────────────────────
load_dotenv()


# ── Genres ────────────────────────────────────────────────────────────────────
GENRES = [
    "acoustic", "afrobeat", "alt-rock", "ambient", "black-metal", "blues",
    "breakbeat", "cantopop", "chicago-house", "chill", "classical", "club",
    "comedy", "country", "dance", "dancehall", "death-metal", "deep-house",
    "detroit-techno", "disco", "drum-and-bass", "dub", "dubstep", "edm",
    "electro", "electronic", "emo", "folk", "forro", "french", "funk",
    "garage", "german", "gospel", "goth", "grindcore", "groove", "guitar",
    "hard-rock", "hardcore", "hardstyle", "heavy-metal", "hip-hop", "house",
    "indian", "indie-pop", "industrial", "jazz", "k-pop", "metal", "metalcore",
    "minimal-techno", "new-age", "opera", "party", "piano", "pop", "pop-film",
    "power-pop", "progressive-house", "psych-rock", "punk", "punk-rock", "rock",
    "rock-n-roll", "romance", "sad", "salsa", "samba", "sertanejo", "show-tunes",
    "singer-songwriter", "ska", "sleep", "songwriter", "soul", "spanish",
    "swedish", "tango", "techno", "trance", "trip-hop",
]


# ── DB helper ─────────────────────────────────────────────────────────────────
def get_connection():
    return mysql.connector.connect(
        host=os.getenv("host"),
        user=os.getenv("user"),
        password=os.getenv("password"),
        database=os.getenv("database"),
    )


# ── Matrix builders ───────────────────────────────────────────────────────────
def build_user_genre_matrix(df: pd.DataFrame) -> pd.DataFrame:
    """
    Input  : DataFrame(uid, favorite_genre, artist_id)
    Output : one-hot DataFrame(uid, *GENRES)
    """
    tmp = df[["uid", "favorite_genre"]].copy()
    tmp["favorite_genre"] = tmp["favorite_genre"].fillna("").apply(
        lambda x: [g.strip() for g in x.split(",") if g.strip()]
    )
    tmp = tmp.explode("favorite_genre")
    tmp = pd.get_dummies(tmp, columns=["favorite_genre"])
    tmp = tmp.groupby("uid").max().reset_index()

    for g in GENRES:
        col = f"favorite_genre_{g}"
        if col not in tmp.columns:
            tmp[col] = 0

    tmp.columns = [c.replace("favorite_genre_", "") for c in tmp.columns]
    tmp = tmp[["uid"] + GENRES]
    return tmp.astype(int)


def build_case_based_genre_matrix(df: pd.DataFrame) -> pd.DataFrame:
    """
    Input  : DataFrame(cbid, genres, artist_id, score)
    Output : one-hot DataFrame(cbid, *GENRES)
    """
    tmp = df[["cbid", "genres"]].copy()
    tmp["genres"] = tmp["genres"].fillna("").apply(
        lambda x: [g.strip() for g in x.split(",") if g.strip()]
    )
    tmp = tmp.explode("genres")
    tmp = pd.get_dummies(tmp, columns=["genres"])
    tmp = tmp.groupby("cbid").max().reset_index()

    for g in GENRES:
        col = f"genres_{g}"
        if col not in tmp.columns:
            tmp[col] = 0

    tmp.columns = [c.replace("genres_", "") for c in tmp.columns]
    tmp = tmp[["cbid"] + GENRES]
    return tmp.astype(int)


# ── Core algorithm ────────────────────────────────────────────────────────────
def cosine_sim(u1, u2) -> float:
    u1, u2 = np.array(u1, dtype=float), np.array(u2, dtype=float)
    norm1, norm2 = np.linalg.norm(u1), np.linalg.norm(u2)
    if norm1 == 0 or norm2 == 0:
        return 0.0
    return float(np.dot(u1, u2) / (norm1 * norm2))


def get_similarity(df: pd.DataFrame, target_vec, id_col: str) -> List[Tuple]:
    X = df.drop(id_col, axis=1).values
    ids = df[id_col].values
    sims = [(ids[i], cosine_sim(target_vec, vec)) for i, vec in enumerate(X)]
    sims.sort(key=lambda x: x[1], reverse=True)
    return sims


def recommend_artists(
    uid: int,
    top_k_users: int = 20,
    top_k_cases: int = 20,
    weight_case: float = 0.7,
    weight_user: float = 0.3,
) -> List[dict]:
    """Full recommendation pipeline for a given user id."""
    conn = get_connection()
    cursor = conn.cursor()

    # ── Load users ──
    cursor.execute("""
        SELECT u.userid, u.favorite_genre,
               GROUP_CONCAT(DISTINCT f.id SEPARATOR ', ') AS artist_id
        FROM user AS u
        INNER JOIN favorite AS f
            ON u.userid = f.user_id AND f.type = 'artist'
        GROUP BY u.userid
    """)
    raw_users = cursor.fetchall()

    # ── Load case-based ──
    cursor.execute("SELECT * FROM case_based;")
    raw_cases = cursor.fetchall()
    conn.commit()
    cursor.close()
    conn.close()

    df_users = pd.DataFrame(raw_users, columns=["uid", "favorite_genre", "artist_id"])
    df_cases = pd.DataFrame(raw_cases, columns=["cbid", "genres", "artist_id", "score"])

    # Check user exists
    if uid not in df_users["uid"].values:
        raise ValueError(f"User {uid} not found in database.")

    df_user_matrix = build_user_genre_matrix(df_users)
    df_case_matrix = build_case_based_genre_matrix(df_cases)

    target_vec = df_user_matrix[df_user_matrix["uid"] == uid].drop("uid", axis=1).values[0]

    # ── Case-based similarity ──
    sim_cases = get_similarity(df_case_matrix, target_vec, "cbid")
    df_sim_cases = pd.DataFrame(sim_cases, columns=["cbid", "sim"])
    df_sim_cases = pd.merge(df_sim_cases, df_cases, on="cbid")

    score_artist: defaultdict = defaultdict(float)

    for k, (_, row) in enumerate(df_sim_cases.iterrows()):
        if k >= top_k_cases:
            break
        sim = float(row["sim"])
        if pd.isna(row["artist_id"]):
            continue
        for artist in str(row["artist_id"]).split(","):
            artist = artist.strip()
            if artist:
                score_artist[artist] += weight_case * sim

    # ── Collaborative filtering ──
    sim_users = get_similarity(df_user_matrix, target_vec, "uid")
    df_sim_users = pd.DataFrame(sim_users, columns=["uid", "sim"])
    df_sim_users = pd.merge(df_sim_users, df_users, on="uid")

    for k, (_, row) in enumerate(df_sim_users.iterrows()):
        if k >= top_k_users:
            break
        sim = float(row["sim"])
        if sim == 1.0:          # skip the target user themselves
            continue
        if pd.isna(row["artist_id"]):
            continue
        for artist in str(row["artist_id"]).split(","):
            artist = artist.strip()
            if artist:
                score_artist[artist] += weight_user * sim

    # ── Sort & enrich with artist info ──
    result = sorted(score_artist.items(), key=lambda x: x[1], reverse=True)
    artist_ids = [a for a, _ in result]

    # Fetch artist_name + images in one query
    artist_info: dict = {}
    if artist_ids:
        conn2 = get_connection()
        cursor2 = conn2.cursor()
        placeholders = ", ".join(["%s"] * len(artist_ids))
        cursor2.execute(
            f"SELECT artistid, artist_name, images FROM artist WHERE artistid IN ({placeholders})",
            artist_ids,
        )
        for row in cursor2.fetchall():
            artist_info[str(row[0])] = {"artist_name": row[1], "images": row[2]}
        cursor2.close()
        conn2.close()
    return [
        {
            "artist_id": a,
            "artist_name": artist_info.get(str(a), {}).get("artist_name"),
            "images": artist_info.get(str(a), {}).get("images"),
            "score": round(s, 6),
        }
        for a, s in result
    ]
