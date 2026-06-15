import { User } from "../models/User.js";
import {connection,mysql} from '../config/db.js'
const getTotalUser = async()=>{
    const query=`
    SELECT count(*) as total from user
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
const getUser =async (data)=>{
    const {email,password}=data;
    const query=`SELECT * from user where email = ? or username = ? and password= ?`
    const result= await connection.getConnection().then((conn)=>{
        const res=conn.query(query,[email,email,password]);
        conn.release();
        return res;
    }).catch((err)=>{
      console.log("An error occur when connect to mysql server"+ err);
    })
    const tmp=result[0][0];
    const user= new User(tmp['userid'],tmp['username'],tmp['favorite_genre'],tmp['email'],tmp['password']);
    return user;
}
const createUser= async (data)=>{
  console.log(data);
  const {user_name,email,password} =data;
  const query=`INSERT INTO USER(username,password,email) values(?,?,?)`
  const result= await connection.getConnection().then((conn)=>{
    const res=conn.query(query,[user_name,password,email]);
    conn.release();
    return res;
  }).catch((err)=>{
    console.log("Can't create new user. Please check again")
  })
  return result
}
const updateUser= async (data)=>{
  const {user_id,user_name,user_password,favorite_genre}=data;
  console.log(data)
  // const query= `UPDATE User set username = ?, password = ?, favorite_genre ?
  //               WHERE userid= ?`
  const query= `UPDATE User set username = COALESCE(NULLIF(?, ''), username)
  , password = COALESCE(NULLIF(?, ''), password)
  , favorite_genre = COALESCE(NULLIF(?, ''), favorite_genre)
                WHERE userid= ?`          
  const result= await connection.getConnection().then((conn)=>{
    const res=conn.query(query,[user_name,user_password,favorite_genre,user_id]);
    conn.release();
    return res;
  }).catch((err)=>{
    console.log("err", err)
    console.log("Can't update user. Please check again");
  })
  return result;
}
const updateUserHistory=async (data)=>{
  const {user_id,item_id,type,time}=data;
  const query= `INSERT INTO history(user_id,item_id,type,time) values(?,?,?,?)`
  const result=await connection.getConnection().then((conn)=>{
    const res=conn.query(query,[user_id,item_id,type,time]);
    conn.release();
    return res;
  }).catch((err)=>{
    console.log(err)
    console.log("Can't update user history. Please check again");
  })
  return result;
}
const getUserHistory=async(data)=>{
  const {user_id}=data;
  const query=`select * from history where user_id= ?`
  const result= await connection.getConnection().then((conn)=>{
    const res=conn.query(query,[user_id]);
    conn.release();
    return res;
  }).catch((err)=>{
    console.log("Can't get user history. Please check again.");
  })
  return result[0];
}
const getUserFavoriteArtist= async(data)=>{
  const {user_id}=data;
  const query=`SELECT f.user_id, f.type, f.id, a.images, a.artist_name
FROM favorite f
JOIN artist a ON f.id = a.artistid 
WHERE f.user_id = ?;`
  const result= await connection.getConnection().then((conn)=>{
    const res=conn.query(query,[user_id]);
    conn.release();
    return res;
  }).catch((err)=>{
    console.log("Can't get user favorite artist. Please check again.");
  })
  return result[0];
}
const getUserFavoriteTrack= async(data)=>{
  const {user_id}=data;
  const query=`SELECT f.user_id, f.type, f.id, t.image, t.track_name
FROM favorite f
JOIN track t ON f.id = t.trackid
WHERE f.user_id = ?;`
  const result= await connection.getConnection().then((conn)=>{
    const res=conn.query(query,[user_id]);
    conn.release();
    return res;
  }).catch((err)=>{
    console.log("Can't get user favorite track. Please check again.");
  })
  return result[0];
}
const addFavoriteArtist = async(data)=>{
  const {user_id,id,type}=data;
  const query=`INSERT INTO favorite(user_id,id,type) values(?,?,?)`;
  const result= await connection.getConnection().then((conn)=>{
    const res=conn.query(query,[user_id,id,type]);
    conn.release();
    return res;
  }).catch((err)=>{
    console.log("Can't add user favorite artist. Please check again.");
  })
  return result;
}
const addFavoriteTrack= async(data)=>{
  const {user_id,id,type}=data;
  const query=`INSERT INTO favorite(user_id,id,type) values(?,?,?)`;
  const result=await connection.getConnection().then((conn)=>{
    const res=conn.query(query,[user_id,id,type]);
    conn.release();
    return res;
  }).catch((err)=>{
    console.log("Can't add user favorite track. Please check again.");
  })
  return result;
}
const delFavorite= async(data)=>{
  console.log(data)
  const {user_id,id,type}=data;
  const query=`delete from favorite where user_id = ? and id = ? and type = ?;`;
  const result=await connection.getConnection().then((conn)=>{
    const res=conn.query(query,[user_id,id,type]);
    conn.release();
    return res;
  }).catch((err)=>{
    console.log("Can't delete favorite. Please check again.");
  })
  return result;
}

const addFavoriteAlbum= async(data)=>{
  const {user_id,id,type}=data;
  const query=`INSERT INTO favorite(user_id,id,type) values(?,?,?)`;
  const result=await connection.getConnection().then((conn)=>{
    const res=conn.query(query,[user_id,id,type]);
    conn.release();
    return res;
  }).catch((err)=>{
    console.log("Can't add user favorite album. Please check again.");
  })
  return result;
}


const getUserFavouriteGenre = async (uid) =>{
  console.log(uid)
  const query = `select favorite_genre from user where userid = ?;`;
  const result = await connection.getConnection().then((conn)=>{
    const res=conn.query(query,[parseInt(uid)]);
    conn.release();
    return res;
  }).catch((err)=>{
    console.log("err", err);
  })
  return result[0];
}
// const r = await getUserFavouriteGenre(2)
// console.log(r)

// const data={
//     'user_name':'hao',
//     'password':'234'

// }
// const result=await getUser(data)
// console.log(result)
export {
  getTotalUser,getUser,
  updateUser,createUser,
  getUserFavoriteArtist, getUserFavoriteTrack,getUserHistory,
  addFavoriteAlbum,addFavoriteArtist,delFavorite,
  addFavoriteTrack, getUserFavouriteGenre,updateUserHistory
}