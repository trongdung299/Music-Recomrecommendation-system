import {getAlbumHome} from "../services/AlbumService.js";

const getAlbumHome_method = async (req, res) => {
    try{
       const data=req.params;
       console.log(data);
       const content = await getAlbumHome(data.limit);
       if (content){
        res.status(200).send(content);
        // console.log(artistHomeTrend)
       }
    }
    catch(err){
        res.status(501).send('Server error')
    }
};

export {
    getAlbumHome_method
}