import  express from 'express'
import cors from 'cors';
import { userRouter } from './routes/UserRoute.js';
import {trackRouter} from './routes/TrackRoute.js';
import {artistRouter} from './routes/ArtistRoute.js';
import {albumRouter} from './routes/AlbumRoute.js';
import {playlistRouter} from './routes/PlaylistRoute.js';
import { recommedRouter } from './routes/recommendRoutes.js';
const app=express();
app.use(cors());
app.use(express.json());
app.use("/user",userRouter)
app.use("/track",trackRouter)
app.use("/artist",artistRouter)
app.use("/album",albumRouter)
app.use("/playlist",playlistRouter)
app.use('/api/recommend', recommedRouter);
export{
    app
}