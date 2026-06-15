import express from "express"
import {addplaylist_method, addtracktoplaylist_method, getplaylistbyuser_method, getPlaylistHome_method, gettrackbyplaylist_method, removetrackfromplaylist_method, updateplaylist_method} from "../controllers/PlaylistController.js"
const playlistRouter=express.Router()
playlistRouter.get('/playlist-home',getPlaylistHome_method)
playlistRouter.post('/playlist-by-user',getplaylistbyuser_method);
playlistRouter.post('/track-by-playlist',gettrackbyplaylist_method);
playlistRouter.post('/remove-track',removetrackfromplaylist_method);
playlistRouter.post('/add-track-to-playlist',addtracktoplaylist_method);
playlistRouter.post('/update-playlist',updateplaylist_method);
playlistRouter.post('/add-playlist',addplaylist_method);
export {
    playlistRouter
}