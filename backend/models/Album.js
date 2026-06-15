import {connection,mysql} from '../config/db.js'
const getTotalAblum = async()=>{
    const query=`Select count(*) as total from album`;
    const result=await connection.getConnection().then((conn)=>{
        const res=conn.query(query);
        conn.release();
        return res;
    }).catch((err)=>{
        console.log("An error occur when connect to mysql server")
    });
    return result
}