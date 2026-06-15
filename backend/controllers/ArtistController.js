import {getArtistHomeTrend} from "../services/ArtistService.js";

const artist_home_trend_method = async (req, res) => {
    try{
       const data=req.params;
       console.log(data);
       const artistHomeTrend = await getArtistHomeTrend(data.limit);
       if (artistHomeTrend){
        res.status(200).send(artistHomeTrend);
        // console.log(artistHomeTrend)
       }
    }
    catch(err){
        res.status(501).send('Server error')
    }
};

export {
    artist_home_trend_method
}