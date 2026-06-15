import express from "express"
import { add_favorite_album, add_favorite_artist, add_favorite_track, get_user_favorite_artist,get_user_favorite_track
    , get_user_history, login_method, signup_method, del_favourite,
     update_user_method, get_u_favourite_genres,update_user_history_method} from "../controllers/UserController.js"
const userRouter=express.Router()
userRouter.post('/login',login_method);
userRouter.post('/signup',signup_method);
userRouter.post('/history',get_user_history);
userRouter.post('/favorite-track',get_user_favorite_track);
userRouter.post('/favorite-artist',get_user_favorite_artist);
userRouter.post('/favorite/artist',add_favorite_artist);
userRouter.post('/favorite/track',add_favorite_track);
userRouter.post('/favorite/album',add_favorite_album);
userRouter.post('/update-user',update_user_method);
userRouter.post('/update-user-history',update_user_history_method)
userRouter.post('/del-favorite',del_favourite);
userRouter.get('/favourite-genres/:uid',get_u_favourite_genres);
export {
    userRouter
}