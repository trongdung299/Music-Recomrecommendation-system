import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({path: path.resolve(__dirname,'../../.env')})
const spotify_client_id=process.env.clientId
const spotify_client_secret=process.env.clientSecret
const generateRandomString = (length)=>{
     const text='';
     const possible='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz9876543210';
     for (let i=0;i<length;++i){
        text+=possible.charAt(Math.floor(Math.random()*possible.length));
     }
     return text;
};
const get_authentication=(req,res)=>{
    const scope='streaming\
                 user-read-email \
                 user-read-private'
    const state=generateRandomString(16);
    const auth_query_parameters=new URLSearchParams({
        response_type:'code',
        client_id=spotify_client_id,
        scope:scope,
        redirect_uri:'http://localhost:3000',
        state:state
    })
    res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
}
const auth_callback =(req,res)=>{
    const code=req.query.code;
    const authOption={
        url:'https://accounts.spotify.com/api/token',
        form:{
            code:code,
            redirect_uri:'http://127.0.0.1:3000',
            grant_type:'authorization_code'
        },
        headers:{
            'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
      'Content-Type' : 'application/x-www-form-urlencoded'
        },
        json:true
    };
    request.post(authOption,(error,response,body)=>{
        if(!error && response.statusCode===200){
            const access_token=body.access_token;
            res.redirect('/')
        }
    })
}