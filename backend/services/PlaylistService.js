import { connection, mysql } from "../config/db.js";

const getPlaylistHome = async() =>{
    const query = `select * from playlist
limit 5;`
    const result = await connection.getConnection().then((conn)=>{
        const res = conn.query(query)
        conn.release()
        return res
    }).catch((err)=>{
        console.log("error when connect to mysql")
    })
    return result[0]
}
const addPlayList = async(data)=>{
    const {playlistname,userid}=data;
    const query=`INSERT INTO playlist(name) values(?)`;
    const result= await connection.getConnection().then((conn)=>
    {
        const res=conn.query(query,[playlistname]);
        conn.release();
        return res;
    }).catch((err)=>{
        console.log("Can't create new playlist. Please try again.")
    })
    const q=`INSERT INTO user_playlist(user_id,playlistid) 
    VALUES(?,?)`;
    const response= await connection.getConnection().then((conn)=>
    {
        const res=conn.query(q,[userid,result[0]['insertId']]);
        conn.release();
        return res;
    }).catch((err)=>{
        console.log("Can't create new playlist. Please try again.")
    })
    return result[0]['insertId'];

}
const updatePlayList= async(data)=>{
    const {playlistname,playlistdescription,playlistid}=data;
    const query=`UPDATE playlist set name= ?,description = ?
                 WHERE playlistid=? `;
     const result= await connection.getConnection().then((conn)=>
    {
        const res=conn.query(query,[playlistname,playlistdescription,playlistid]);
        conn.release();
        return res;
    }).catch((err)=>{
        console.log("Can't update playlist. Please try again.")
    })
    return result;
}
const addTrackToPlayList= async(data)=>{
    const {trackid,playlistid,total_tracks}=data;
    const query=`INSERT INTO TrackInPlayList(trackid,playlistid) VALUES (?,?);
    update playlist set total_tracks= ? where playlist.playlistid= ?`;
    const result=await connection.getConnection()
    .then((conn)=>{
        const res=conn.query(query,[trackid,playlistid,total_tracks,playlistid]);
        conn.release();
        return res;
    }).catch((err)=>{
        console.log(err)
        console.log("Can't add track to playlist. Please try again.")
    })
    return result;
}
const removeTrackFromPlayList= async(data)=>{
     const {trackid,playlistid,total_tracks}=data;
    const query=`DELETE FROM TrackInPlayList WHERE trackid = ? and playlistid = ?;
    update playlist set total_tracks= ? where playlist.playlistid= ?`;
    const result=await connection.getConnection()
    .then((conn)=>{
        const res=conn.query(query,[trackid,playlistid,total_tracks,playlistid]);
        conn.release();
        return res;
    }).catch((err)=>{
        console.log("Can't delete track from playlist. Please try again.")
    })
    return result;
}
const getTrackByPlayList= async(data)=>{
    const {playlistid} = data;
    const query= `select track.trackid,track.track_name,track.image,track.duration_ms,A.t_name
from track join 
(select trackinplaylist.trackid,group_concat(distinct artist.artist_name order by artist.artist_name separator ', ') as t_name
 from trackinplaylist join artisttrack on artisttrack.trackid=trackinplaylist.trackid
 join artist on artist.artistid=artisttrack.artistid
 where trackinplaylist.playlistid= ? 
 group by trackinplaylist.trackid) as A on 
 track.trackid=A.trackid `
    const result=await connection.getConnection()
    .then((conn)=>{
        const res=conn.query(query,[playlistid]);
        conn.release();
        return res;
    }).catch((err)=>{
        console.log("Can't get track by playlist id");
    })
    return result[0];
}
const getPlayListByUser=async(data)=>{
    const {userid}=data;
    const query=`select playlist.playlistid,playlist.name, playlist.total_tracks from playlist,user_playlist
where user_playlist.user_id=?
and user_playlist.playlistid=playlist.playlistid`
    const result=await connection.getConnection()
    .then((conn)=>{
        const res=conn.query(query,[userid]);
        conn.release();
        return res;
    }).catch((err)=>{
        console.log("Can't get playlist by user id");
    })
    return result[0];
}
const getAllPlaylist =async(data)=>{
    const {limit}=data;
    const query=`select * from playlist,user_playlist
where playlist.playlistid=user_playlist.playlistid and user_playlist.user_id=10
limit ?;
    `
}
export{
    getPlaylistHome,addPlayList,
    updatePlayList,addTrackToPlayList,
    removeTrackFromPlayList,
    getTrackByPlayList,getPlayListByUser
}