import os
from dotenv import  load_dotenv
import mysql.connector
import numpy as np
from tqdm import tqdm
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
def get_user_current_data(user_id,interval=10):

   query='''select track.trackid,track.track_name,track.popularity,track.year,track.genre,
at.artistid,at.artist_name,at.popularity
from track
join history h on h.item_id=track.trackid
join artisttrack ar on ar.trackid=track.trackid
join artist at on at.artistid=ar.artistid
where  h.user_id= %s and datediff(now(),h.time)<= %s;'''
   val=(user_id,interval)
   mycursor.execute(query, val)
   tracks=mycursor.fetchall()
   current_genre = set(t[4] for t in tracks)
   current_year=set(t[3] for t in tracks)
   current_artist=set(t[1] for t in tracks)

   return current_genre,current_year,current_artist
def get_playlist_detail(playlist_id):

   query='''
   select pl.playlistid,track.genre,track.year,at.artist_name,track.popularity 
from track
join trackinplaylist tp on tp.trackid=track.trackid
join artisttrack ar on ar.trackid=track.trackid
join artist at on at.artistid=ar.artistid
join playlist pl on tp.playlistid=pl.playlistid
where pl.playlistid= %s;
   '''
   val=(playlist_id,)
   mycursor.execute(query, val)
   tracks = mycursor.fetchall()
   playlists = {}
   for playlist_id, genre, year, artist,popularity in tracks:
       if playlist_id not in playlists:
           playlists = {'id':playlist_id,'genre': set(), 'year': set(),
                                     'artist': set()}
       playlists['genre'].add(genre)
       playlists['year'].add(year)
       playlists['artist'].add(artist)
   return playlists
def calculate_playlist_score(current_genre, current_year, current_artist,all_playlists):
    cg=current_genre
    cy=current_year
    ca=current_artist
    scores = []
    for pl in tqdm(all_playlists):
      try:
        vec = np.array([
            len(pl['genre'] & cg) / max(len(cg), 1),
            len(pl['year'] & cy) / max(len(cy), 1),
            len(pl['artist'] & ca) / max(len(ca), 1),
        ])
        scores.append({'id': pl['id'], 'score': np.linalg.norm(vec)})
      except:
          print(pl)
    return scores
def buil_all_playlist(playlist_ids):
    all_playlist = []
    for pl_id in tqdm(playlist_ids):
        all_playlist.append(get_playlist_detail(pl_id))
    return all_playlist
def get_recommend(top_k,uid,all_playlist,interval):

  current_genre, current_year, current_artist=get_user_current_data(uid,interval=interval)
  scores=calculate_playlist_score(current_genre,current_year,current_artist,all_playlist)
  score_sorted=sorted(scores,key=lambda x:x['score'],reverse=True)
  score_sorted=score_sorted[:top_k]
  ids=[i['id'] for i in score_sorted]
  txt=', '.join(['%s'] * len(ids))
  query=f'''
  select * from playlist where playlistid in ({txt})
  '''
  mycursor.execute(query,ids)
  result=mycursor.fetchall()
  result=[{'id':it[0],'name':it[3],'total_track':it[4]} for it in result]
  return result



