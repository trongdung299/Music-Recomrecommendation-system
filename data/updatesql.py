import json
import os
from tqdm import tqdm
import mysql.connector
import pandas as pd
from dotenv import load_dotenv
import zipfile
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
def update_track_image():
    sql='''update track set image= %s where trackid = %s '''
    track_images=pd.read_csv('track_image__.csv')
    track_images=track_images.dropna()
    for index,row in tqdm(track_images.iterrows()):
        val=(row['image'],row['id'])
        try:
            mycursor.execute(sql,val)
            mydb.commit()
        except:
            print(val)
            break
def update_album_image():
    # directory = 'D:\\albums'
    # for file in os.listdir(directory):
    #     if file[-4:]=='.zip':
    #         with zipfile.ZipFile(os.path.join(directory,file),'r') as zip_ref:
    #             zip_ref.extractall(directory)
    new_directory='D:\\albums\\content\\data'
    aimages=[]
    aid=[]
    tids=[]
    timages=[]
    sql='''UPDATE ALBUM SET images= %s WHERE albumid = %s'''
    sql_2='''UPDATE TRACK SET image=%s WHERE trackid= %s'''
    for file in tqdm(os.listdir(new_directory)):
        if file[-5:]=='.json':
            with open(os.path.join(new_directory,file),'r') as f:
                data=json.load(f)
                try:
                    val=(data['images'][0]['url'],data['id'])
                    mycursor.execute(sql,val)
                    mydb.commit()
                except:
                    print(f'err: {data['id']}')
                    continue
                for track in data['tracks']['items']:
                    val=(data['images'][0]['url'],track['id'])
                    try:
                        mycursor.execute(sql_2,val)
                        mydb.commit()
                    except:
                        print(f'err: {data['id']}')
                        continue
if __name__=="__main__":
    #update_track_image()
    #print(len(os.listdir('D:\\albums\\content\\data')))
    update_album_image()