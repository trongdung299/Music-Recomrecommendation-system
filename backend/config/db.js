import  mysql from 'mysql2/promise'
import  path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
const __filename=fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filename)
dotenv.config({path: path.resolve(__dirname,'../../.env')})
console.log(path.resolve(__dirname,"../../.env"))
const  config = {
    host:process.env.host,
    user:process.env.user,
    password:process.env.password,
    database:process.env.database,
    multipleStatements: true
}
const connection=mysql.createPool(config)
console.log("Connect to mysql server successfully")
// connection.query('SELECT * FROM Artist',(err,rows,fiedls)=>{
//   if(err) throw err;
//   console.log('Artist data: ',rows)
// })
// connection.end()
export {
  mysql,connection
}
