import {connection,mysql} from '../config/db.js'

const getTotalArtist= async()=>
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
}

const getArtistHomeTrend = async(limit)=>{
  const query=`select  * from artist as a
    order by a.popularity desc
    limit ?`
  const result= await connection.getConnection()
  .then((conn)=>{
    const res=conn.query(query,[parseInt(limit)]);
    conn.release();
    return res;
  })
  .catch((err)=>{
    console.log("An error occur when connect to mysql server")
  })
  return result[0]
}

// const result = await getArtistHomeTrend()
// console.log(result)

export {
  getTotalArtist, getArtistHomeTrend
}