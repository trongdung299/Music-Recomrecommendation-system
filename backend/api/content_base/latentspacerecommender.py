import pandas as pd
import faiss
from tqdm import tqdm
class LatentSpaceRecommender:
    def __init__(self,data_path):
        print("Starting Service")
        chunks=[]
        chunk_size=10000
        for chunk in tqdm(pd.read_csv(data_path,chunksize=chunk_size)):
            chunks.append(chunk)
        self.tracks=pd.concat(chunks)
        self.data=self.tracks.dropna().reset_index(drop=True)
        self.vectordb=self.data.drop(['id','filename','Unnamed: 0','artist_name',
 'track_name','track_id','popularity','year','genre','danceability',
 'energy','key','loudness','mode','speechiness','acousticness','instrumentalness',
 'liveness','valence','tempo','duration_ms','time_signature'],axis=1)
        self.vectordb=self.vectordb.to_numpy(dtype='float32')
        self.index=faiss.IndexFlatIP(self.vectordb.shape[1])
        self.index.add(self.vectordb)
        self.track_index={}
        for i in tqdm(range(len(self.data))):
            self.track_index[self.data.iloc[i]['id']]=i
        print('Service start successfully!')
    def recommend(self,track_id,top_k=10):
        track_ids=list(self.track_index.keys())
        if track_id not in track_ids:
            return []
        i=self.track_index[track_id]
        distances,indices=self.index.search(
        self.vectordb[i].reshape(1,-1),top_k+5)
        results=[]
        for j in indices[0][1:]:
            row=self.data.iloc[j]
            results.append({
            'track_id':row['id'],
            'track_name':row['track_name'],
            'artist_name':row['artist_name'],
            'duration_ms':row['duration_ms']
            })
            if len(results)>=top_k:
                break
        return results