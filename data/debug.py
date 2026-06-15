# import pandas as pd
# #artist=pd.read_csv('artist_2_.csv')
# # artist_1=pd.read_csv('artist_1.csv')
# # # final=pd.concat([artist,artist_1])
# # # final.to_csv('artist.csv')
# #artist=artist.drop('index',axis=1)
# # # print(artist_1.columns)
# # artist_1.to_csv('artist_1.csv',index=False)]
# #artist=artist.fillna("image")
# #artist.to_csv('artist.csv',index=False)
# # new_genres=[]
# # for index,row in artist.iterrows():
# #     gr=row['genres'][1:][:-1]
# #     if gr=='':
# #        new_genres.append('empty')
# #     else:
# #         g=[]
# #         for it in gr.split(','):
# #             g.append(it.strip()[1:][:-1])
# #         new_genres.append(','.join(g))
# # artist['genres']=new_genres
# # print(artist['genres'].head(5))
# # artist.to_csv('aritst_2_.csv',index=False)
# artist_album=pd.read_csv('artistalbum.csv')
# artist_album=artist_album[['artist_id','album_id']]
# artist_album.to_csv("artistalbum.csv",index=False)
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
# artist=pd.read_csv('join_artist.csv')
# success=0
# err=0
# for index,row in tqdm(artist.iterrows()):
#     sql='UPDATE  artist SET followers = %s, popularity = %s WHERE artistid = %s'
#     val=(row['followers_y'],row['popularity_y'],row['spotify_id'])
#     try:
#         mycursor.execute(sql, val)
#         success+=1
#     except:
#         err+=1
# mydb.commit()
# print(f'total error item: {err}/{artist.shape[0]}')
# print(f'Total success item: {success}/{artist.shape[0]}')
# sql='''
# select album.albumid,album.album_name,artist.artist_name,artist.popularity from artistalbum,album,artist
# where artistalbum.albumid=album.albumid and album.images not like 'https%'
# and artistalbum.artistid=artist.artistid order by artist.popularity desc
# '''
# sql='''
# select * from trackinalbum
# '''
sql='''
update track set image= %s where trackid = %s 
'''

mycursor.execute(sql)
result=mycursor.fetchall()
trackids=[]
albumids=[]

for it in tqdm(result):
    #trackids.append(it[0])
    albumids.append(it[1])
pd.DataFrame({
    # 'track_id':trackids,
    'album_id':albumids
}).to_csv('album_.csv',index=False)
