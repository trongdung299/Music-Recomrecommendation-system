import { recommendForHome,recommendBySeeds } from "../services/albumRecommender.js";

// GET /api/recommend/home?limit=20&maxPerArtist=3
async function getHomeRecommendations(req, res) {
  try {
    const limit        = parseInt(req.query.limit)        || 20;
    const maxPerArtist = parseInt(req.query.maxPerArtist) || 3;
    const data = await recommendForHome({ limit, maxPerArtist });
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    console.error('[Recommend] getHomeRecommendations:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
}

// POST /api/recommend/albums
// Body: { seedAlbumIds: [...], limit: 20, maxPerArtist: 3 }
async function getAlbumRecommendations(req, res) {
  try {
    const { seedAlbumIds = [], limit = 20, maxPerArtist = 3 } = req.body;
    if (!Array.isArray(seedAlbumIds)) {
      return res.status(400).json({ success: false, error: 'seedAlbumIds phải là một mảng' });
    }
    const data = await recommendBySeeds(seedAlbumIds, { limit, maxPerArtist });
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    console.error('[Recommend] getAlbumRecommendations:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
}

export { getHomeRecommendations, getAlbumRecommendations };