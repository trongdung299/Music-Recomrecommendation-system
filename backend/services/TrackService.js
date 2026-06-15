import {connection,mysql} from '../config/db.js'
const getTotalTrack = async()=>{
    const query=`
    SELECT count(*) as total from track 
    `
    const result = await connection.getConnection()
  .then((conn) => {
    const res = conn.query(query);
    conn.release();
    return res;
   })
  .catch((err) => {
    console.log("An error occur when connect to mysql server "+ err);
  });
  return result
}

const getTrack= async()=>
{
  const query=`SELECT * FROM artist`
  const result= await connection.getConnection()
  .then((conn)=>{
    const res=conn.query(query);
    conn.release();
    return res;
  })
  .catch((err)=>{
    console.log("An error occur when connect to mysql server")
  })
  return result
}

const getTrackHomeTrend = async(limit) =>{
  console.log("limit", limit)
  const query=`
 SELECT 
    t.trackid, t.track_name, t.image, t.popularity,t.duration_ms,
    GROUP_CONCAT(DISTINCT a.artist_name ORDER BY a.artist_name SEPARATOR ', ') AS artist
FROM (
    SELECT trackid, track_name, image, popularity,duration_ms
    FROM track 
    ORDER BY popularity DESC 
    LIMIT ?
) AS t
LEFT JOIN artisttrack AS a_t ON t.trackid = a_t.trackid
LEFT JOIN artist AS a ON a_t.artistid = a.artistid
GROUP BY t.trackid;`
  const result= await connection.getConnection()
  .then((conn)=>{
    const res=conn.query(query,[parseInt(limit)]);
    conn.release();
    console.log(res)
    return res;
  })
  .catch((err)=>{
    // console.log(err)
    console.log("An error occur when connect to mysql server")
  })
  // console.log(result)
  return result[0]
}

const getTrackHomeRecommend = async(limit) =>{
  const query=`
  SELECT 
    t.trackid, t.track_name, t.image, t.popularity,t.duration_ms,
    GROUP_CONCAT(DISTINCT a.artist_name ORDER BY a.artist_name SEPARATOR ', ') AS artist
FROM track AS t
INNER JOIN artisttrack AS a_t ON t.trackid = a_t.trackid
INNER JOIN artist AS a ON a_t.artistid = a.artistid
GROUP BY 
    t.trackid
ORDER BY t.popularity DESC
LIMIT ?;`
  const result= await connection.getConnection()
  .then((conn)=>{
    const res=conn.query(query, [parseInt(limit)]);
    conn.release();
    return res;
  })
  .catch((err)=>{
    console.log("An error occur when connect to mysql server")
  })
  return result[0]
}
// const result =await getTrackHomeTrend()
// console.log(result)
const getTotalGenre = async() =>{
  const query=`SELECT genre
FROM track
GROUP BY genre
ORDER BY genre ASC;`
  const result= await connection.getConnection()
  .then((conn)=>{
    const res=conn.query(query);
    conn.release();
    return res;
  })
  .catch((err)=>{
    console.log("An error occur when connect to mysql server")
  })
  return result[0]
}
const getGenre = async() =>{
  const query=`SELECT genre
FROM track
GROUP BY genre
ORDER BY genre ASC limit 10;`
  const result= await connection.getConnection()
  .then((conn)=>{
    const res=conn.query(query);
    conn.release();
    return res;
  })
  .catch((err)=>{
    console.log("An error occur when connect to mysql server")
  })
  return result[0]
}
const getTrackByArtist=async(data)=>{
  const {artist_id}=data;
  const query=`
  select track.trackid,track.track_name,track.image,track.duration_ms,A.t_name
from track join 
(select artisttrack.trackid,group_concat(distinct artist.artist_name order by artist.artist_name separator ', ') as t_name
 from artist join artisttrack on artisttrack.artistid=artist.artistid
 where artist.artistid= ?
 group by artisttrack.trackid) as A on 
 track.trackid=A.trackid
 order by popularity desc;
  `
  const result=await connection.getConnection()
  .then((conn)=>{
    const res=conn.query(query,[artist_id]);
    conn.release();
    return res;
  }).catch((err)=>{
    console.log("An error occur when connect to my sql",err)
  })
  return result[0]
}
const getTrackByAlbum=async(data)=>{
  const {album_id}=data;
  const query=`
   SELECT 
    t.trackid,
    t.track_name,
    t.image,
    t.duration_ms,
    GROUP_CONCAT(DISTINCT ar.artist_name ORDER BY ar.artist_name SEPARATOR ', ') AS t_name
FROM track t
INNER JOIN trackinalbum ta ON t.trackid = ta.trackid
INNER JOIN artisttrack at ON t.trackid = at.trackid
INNER JOIN artist ar ON at.artistid = ar.artistid
WHERE ta.albumid = ?
GROUP BY t.trackid
ORDER BY t.popularity DESC;
  `
  const result=await connection.getConnection().then((conn)=>{
    const res=conn.query(query,[album_id]);
    conn.release();
    return res;
  }).catch((err)=>{
    console.log("An error occur when connect to mysql server",err);
  })
  return result[0];
}
const getTrackByPlayList= async(data)=>{
  const {playlist_id}=data;
  const query=`
  select t.trackid,t.track_name,t.image,t.duration_ms, GROUP_CONCAT(DISTINCT ar.artist_name ORDER BY ar.artist_name SEPARATOR ', ') AS t_name
from track t 
inner join trackinplaylist tp on tp.trackid=t.trackid
inner join artisttrack at on at.trackid=t.trackid
inner join artist ar on ar.artistid=at.artistid
where tp.playlistid= ?
group by t.trackid
order by t.popularity
desc
  `
  const result=await connection.getConnection().then((conn)=>{
    const res=conn.query(query,[playlist_id]);
    conn.release();
    return res;
  }).catch((err)=>{
    console.log("An error occur when connect to mysql server",error)
  })
  return result[0]
}
export {
  getTotalTrack,getTrack, getTrackHomeTrend,
   getTrackHomeRecommend, getTotalGenre, 
   getGenre,getTrackByArtist,getTrackByAlbum,getTrackByPlayList
}
