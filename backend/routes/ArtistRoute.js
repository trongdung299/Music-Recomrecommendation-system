import express from "express"
import {artist_home_trend_method} from "../controllers/ArtistController.js"
const artistRouter=express.Router()
artistRouter.get('/artist-home-trend/:limit',artist_home_trend_method)
// artistRouter.get('/track-home-recommned',track_home_recommend_method)
export {
    artistRouter
}