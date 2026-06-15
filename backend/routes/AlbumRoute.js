import express from "express"
import {getAlbumHome_method} from "../controllers/AlbumController.js"
const albumRouter=express.Router()
albumRouter.get('/album-home/:limit',getAlbumHome_method)
// artistRouter.get('/track-home-recommned',track_home_recommend_method)
export {
    albumRouter
}