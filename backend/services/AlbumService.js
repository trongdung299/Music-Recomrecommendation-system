import { connection, mysql } from '../config/db.js'

const getAlbumHome = async (limit) => {
    const query = `select a.albumid, a.album_name, group_concat(DISTINCT a2.artist_name ORDER BY a2.artist_name SEPARATOR ', ') as artist_name from album as a
inner join artistalbum as a1 on a1.albumid = a.albumid
inner join artist as a2 on a1.artistid = a2.artistid 
group by a.albumid
limit ?;`
    const result = await connection.getConnection().then((conn) => {
        const res = conn.query(query, [parseInt(limit)])
        conn.release()
        return res
    }).catch((error) => {
        console.log("Error when connect to mysql")
    })
    return result[0]
}

export {
    getAlbumHome
}