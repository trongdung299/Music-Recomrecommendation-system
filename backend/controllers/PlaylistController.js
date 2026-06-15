import {addPlayList, addTrackToPlayList, getPlayListByUser, getPlaylistHome, getTrackByPlayList, removeTrackFromPlayList, updatePlayList} from "../services/PlaylistService.js";

const getPlaylistHome_method = async (req, res) => {
    try{
       const data=req.body;
       console.log(data);
       const content = await getPlaylistHome();
       if (content){
        res.status(200).send(content);
        // console.log(artistHomeTrend)
       }
    }
    catch(err){
        res.status(501).send('Server error')
    }
};
const addplaylist_method= async(req,res)=>{
    try{
        const data=req.body;
        console.log(data);
        const response=await addPlayList(data);
        if(response){
            res.status(200).send(response);
        } else{
            res.status(400).send("An error occur");

        }
    } catch(err){
        res.status(501).send("Server error.");
    }
}
const updateplaylist_method=async(req,res)=>{
    try{
        const data=req.body;
        console.log(data);
        const response=await updatePlayList(data);
        if(response){
            res.status(200).send(response);
        } else{
            res.status(400).send("An error occur");
        }
    }catch(err){
        res.status(501).send("Server error.")
    }
}
const addtracktoplaylist_method=async(req,res)=>{
    try{
        const data=req.body;
        console.log(data);
        const response=await addTrackToPlayList(data);
        if(response){
            res.status(200).send(response);
        } else{
            res.status(400).send("An error occur");
        }
    }catch(err){
        res.status(501).send("Server error.")
    }
}
const removetrackfromplaylist_method=async(req,res)=>{
    try{
        const data=req.body;
        console.log(data);
        const response=await removeTrackFromPlayList(data);
        if(response){
            res.status(200).send(response);
        } else{
            res.status(400).send('An error occur');
        }
    } catch(err){
        res.status(501).send('Server error.');
    }
}
const gettrackbyplaylist_method=async(req,res)=>{
    try{
        const data=req.body;
        console.log(data);
        const response=await getTrackByPlayList(data);
        if(response){
            res.status(200).send(response);
        } else{
            res.status(404).send("Not Found.");
        }
    } catch(err){
        res.status(501).send('Server error.');
    }
}
const getplaylistbyuser_method= async(req,res)=>{
    try{
        const data=req.body;
        console.log(data);
        const response=await getPlayListByUser(data);
        if(response){
            res.status(200).send(response);
        } else{
            res.status(404).send('Not Found.');
        }
    } catch(err){
        res.status(501).send("Server error.")
    }
}
export {
    getPlaylistHome_method,
    getplaylistbyuser_method,gettrackbyplaylist_method,
    removetrackfromplaylist_method,
    addtracktoplaylist_method,
    updateplaylist_method,addplaylist_method
}