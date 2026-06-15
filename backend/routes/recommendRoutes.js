import express from 'express'
import { getHomeRecommendations,getAlbumRecommendations } from '../controllers/recommendController.js';
const recommedRouter  = express.Router();
recommedRouter.get('/home', getHomeRecommendations);
recommedRouter.post('/albums', getAlbumRecommendations);

export { recommedRouter};