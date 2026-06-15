import os
from tqdm import tqdm
import mysql.connector
import pandas as pd
from dotenv import load_dotenv
load_dotenv()
host=os.getenv('host')
user=os.getenv('user')
password=os.getenv('password')
database=os.getenv('database')
mydb = mysql.connector.connect(
  host=host,
  user=user,
  password=password,
  database=database
)
mycursor = mydb.cursor()
file_list=[
         {'name':'artisttrack_.csv','type':'artisttrack'},
          {'name':'artist_1_.csv','type':'artist'},
           {'name':'album.csv','type':'album'},
           {'name':'artistalbum.csv','type':'artistalbum'},
           {'name':'trackinalbum.csv','type':'trackinalbum'}]
for file in tqdm(file_list):
  df=pd.read_csv(file['name'])
  df=df.fillna('empty')
  print()
  print(f'insert file {file['type']}')
  err=0
  success=0
  for index,row in df.iterrows():
    sql=''
    val=()
    if file['type']=='album':
        val=(row['id'],row['images'],row['name'],row['release_date'],row['total_track'])
        sql="INSERT INTO Album (albumid,images,album_name,releasedate,total_track) VALUES (%s,%s,%s,%s,%s)"
    elif file['type']=='artist':
        val=(row['artist_id'],row['artist_name'],row['artist_img'],row['artist_genre'],row['followers'],row['popularity'],row['country'])
        sql="INSERT INTO Artist (artistid,artist_name,images,artist_genre,followers,popularity,country) VALUES (%s,%s,%s,%s,%s,%s,%s)"
    elif file['type']=='artistalbum':
        val=(row['artist_id'],row['album_id'])
        sql="INSERT INTO ArtistAlbum (artistid,albumid) VALUES (%s,%s)"
    elif file['type']=='artisttrack':
        val=(row['artist_id'],row['track_id'])
        sql='INSERT INTO ArtistTrack (artistid,trackid) VALUES (%s,%s)'
    elif file['type']=='trackinalbum':
        val=(row['track_id'],row['album_id'])
        sql='INSERT INTO TrackInAlbum (trackid,albumid) VALUES (%s,%s)'
    try:
        mycursor.execute(sql, val)
        success+=1
    except:
        err+=1
  print(f'total error item: {err}/{df.shape[0]}')
  print(f'Total success item: {success}/{df.shape[0]}')
  break
mydb.commit()

print(mycursor.rowcount, "record inserted.")