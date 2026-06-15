/**
 * backend/albumRecommender.js
 *
 * Hybrid Album Recommendation — Lai kiểu đường ống (Pipeline Cascade)
 * Slide L7: Kết hợp các kỹ thuật gợi ý
 *
 * Tầng 1 — Content-Based: cosine similarity audio features
 * Tầng 2 — Weighted Scoring: α×content + β×popularity + γ×recency
 * Tầng 3 — Diversity Filter: giới hạn album mỗi artist
 */

import { connection } from "../config/db.js";

const WEIGHTS = { content: 0.60, popularity: 0.25, recency: 0.15 };

const AUDIO_FEATURES = [
  'danceability', 'energy', 'acousticness',
  'valence', 'speechiness', 'instrumentalness', 'liveness',
];

const MIN_YEAR = 1950;
const MAX_YEAR = new Date().getFullYear();

// ── Utilities ────────────────────────────────────────────────────────────────

function cosineSim(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i];
  }
  return (na === 0 || nb === 0) ? 0 : dot / (Math.sqrt(na) * Math.sqrt(nb));
}

function normalizeArray(arr) {
  const min = Math.min(...arr), max = Math.max(...arr);
  if (max === min) return arr.map(() => 1);
  return arr.map(v => (v - min) / (max - min));
}

function releaseYearScore(dateStr) {
  if (!dateStr) return 0;
  const year = new Date(dateStr).getFullYear();
  return isNaN(year) ? 0 : (year - MIN_YEAR) / (MAX_YEAR - MIN_YEAR);
}

function albumFeatureVector(album) {
  return AUDIO_FEATURES.map(f => parseFloat(album[`avg_${f}`]) || 0);
}

function computeCentroid(albums) {
  const vecs = albums.map(albumFeatureVector);
  const dim  = vecs[0].length;
  const c    = new Array(dim).fill(0);
  for (const v of vecs) v.forEach((x, i) => { c[i] += x; });
  return c.map(x => x / vecs.length);
}

// ── Query MySQL ───────────────────────────────────────────────────────────────

async function fetchAlbumsWithFeatures() {
  const query = `
    SELECT
      a.albumid,
      a.album_name,
      a.images        AS album_images,
      a.releasedate,
      ar.artistid,
      ar.artist_name,
      ar.images       AS artist_images,
      AVG(t.danceability)     AS avg_danceability,
      AVG(t.energy)           AS avg_energy,
      AVG(t.acousticness)     AS avg_acousticness,
      AVG(t.valence)          AS avg_valence,
      AVG(t.speechiness)      AS avg_speechiness,
      AVG(t.instrumentalness) AS avg_instrumentalness,
      AVG(t.liveness)         AS avg_liveness,
      AVG(t.tempo)            AS avg_tempo,
      AVG(t.loudness)         AS avg_loudness
    FROM Album a
    JOIN TrackInAlbum tia ON a.albumid = tia.albumid
    JOIN Track t          ON tia.trackid = t.trackid
    JOIN ArtistAlbum aa   ON a.albumid = aa.albumid
    JOIN Artist ar        ON aa.artistid = ar.artistid
    GROUP BY
      a.albumid, a.album_name, a.images, a.releasedate,
      ar.artistid, ar.artist_name, ar.images
  `;
  const conn = await connection.getConnection();
  try {
    const [rows] = await conn.query(query);
    return rows;
  } finally {
    conn.release();
  }
}

// ── Tầng 2: Weighted Hybrid Scoring ─────────────────────────────────────────

function hybridScoring(candidates, excludeIds = []) {
  if (!candidates.length) return [];
  const exclude = new Set(excludeIds);
  const pool    = candidates.filter(a => !exclude.has(a.albumid));

  const popNorm     = normalizeArray(pool.map(a => parseFloat(a.album_popularity) || 0));
  const recencyNorm = normalizeArray(pool.map(a => releaseYearScore(a.releasedate)));
  const simNorm     = normalizeArray(pool.map(a => a._sim_content ?? 0.5));

  return pool.map((album, i) => ({
    ...album,
    _score_content:    +simNorm[i].toFixed(4),
    _score_recency:    +recencyNorm[i].toFixed(4),
    _hybrid_score:     +(
      WEIGHTS.content    * simNorm[i] +
      WEIGHTS.popularity * popNorm[i] +
      WEIGHTS.recency    * recencyNorm[i]
    ).toFixed(4),
  })).sort((a, b) => b._hybrid_score - a._hybrid_score);
}

// ── Tầng 3: Diversity Filter ─────────────────────────────────────────────────

function diversityFilter(scored, limit, maxPerArtist) {
  const count = {}, result = [];
  for (const album of scored) {
    if (result.length >= limit) break;
    const aid = album.artistid || 'unknown';
    count[aid] = (count[aid] || 0) + 1;
    if (count[aid] <= maxPerArtist) result.push(album);
  }
  // Bù nếu chưa đủ limit
  if (result.length < limit) {
    for (const album of scored) {
      if (result.length >= limit) break;
      if (!result.find(r => r.albumid === album.albumid)) result.push(album);
    }
  }
  return result;
}

function format(album) {
  return {
    albumid:       album.albumid,
    album_name:    album.album_name,
    album_images:  album.album_images,
    releasedate:   album.releasedate,
    artistid:      album.artistid,
    artist_name:   album.artist_name,
    artist_images: album.artist_images,
    _hybrid_score:     album._hybrid_score,
    _score_content:    album._score_content,
    _score_popularity: album._score_popularity,
    _score_recency:    album._score_recency,
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

async function recommendForHome({ limit = 20, maxPerArtist = 3 } = {}) {
  const all    = await fetchAlbumsWithFeatures();
  const scored = hybridScoring(all.map(a => ({ ...a, _sim_content: 0.5 })));
  return diversityFilter(scored, limit, maxPerArtist).map(format);
}

async function recommendBySeeds(seedAlbumIds = [], {
  limit = 20, candidateK = 100, maxPerArtist = 3,
} = {}) {
  const all   = await fetchAlbumsWithFeatures();
  const seeds = all.filter(a => seedAlbumIds.includes(a.albumid));

  let candidates;
  if (!seeds.length) {
    candidates = all.map(a => ({ ...a, _sim_content: 0.5 }));
  } else {
    const centroid = computeCentroid(seeds);
    candidates = all
      .map(a => ({ ...a, _sim_content: cosineSim(albumFeatureVector(a), centroid) }))
      .sort((a, b) => b._sim_content - a._sim_content)
      .slice(0, candidateK);
  }

  const scored = hybridScoring(candidates, seedAlbumIds);
  return diversityFilter(scored, limit, maxPerArtist).map(format);
}

export
{ recommendForHome, recommendBySeeds };