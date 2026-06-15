##code generate data playlist##

import os
from dotenv import  load_dotenv
import mysql.connector
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
def create_playlist_by_year():
    for i in tqdm(range(2000,2024)):
        query = f'''
    select * from track 
    where year ={i} order by popularity desc limit 50;
    '''
        mycursor.execute(query)
        result=mycursor.fetchall()
        create_playlist_sql=f'''
        insert into playlist(name,total_tracks) values('Best of {i}',50);
'''
        mycursor.execute(create_playlist_sql)
        mydb.commit()
        search_playlist_sql=f'''select * from playlist where name='Best of {i}'
    '''
        mycursor.execute(search_playlist_sql)
        playlist=mycursor.fetchall()
        playlist_id=playlist[0][0]
        for it in result:
            insert_trackinplaylist_query=f'''
       insert into trackinplaylist values('{it[0]}','{playlist_id}');
    '''
            mycursor.execute(insert_trackinplaylist_query)
            mydb.commit()
        print(f"Add playlist Best of {i} successfully")
def create_playlist_by_genre():
    genre_query='''
    select distinct genre from track 
    '''
    mycursor.execute(genre_query)
    genres = mycursor.fetchall()
    for it in tqdm(genres):
        i=it[0]
        query = f'''
        select * from track 
        where genre ='{i}' order by popularity desc limit 50;
        '''
        mycursor.execute(query)
        result = mycursor.fetchall()
        create_playlist_sql = f'''
            insert into playlist(name,total_tracks) values('Best of {i}',{len(result)});
    '''
        mycursor.execute(create_playlist_sql)
        mydb.commit()
        search_playlist_sql = f'''select * from playlist where name='Best of {i}'
        '''
        mycursor.execute(search_playlist_sql)
        playlist = mycursor.fetchall()
        playlist_id = playlist[0][0]
        for it in result:
            insert_trackinplaylist_query = f'''
           insert into trackinplaylist values('{it[0]}','{playlist_id}');
        '''
            mycursor.execute(insert_trackinplaylist_query)
            mydb.commit()
        print(f"Add playlist Best of {i} successfully")
def create_playlist_mix():

    genre_query = '''
        select distinct genre from track 
        '''
    mycursor.execute(genre_query)
    genres = mycursor.fetchall()
    for it in tqdm(genres):
        i = it[0]
        for y in range(2000,2024):
            query = f'''
            select * from track 
            where genre ='{i}' and year={y} order by popularity desc limit 50;
            '''
            mycursor.execute(query)
            result = mycursor.fetchall()
            create_playlist_sql = f'''
                insert into playlist(name,total_tracks) values('Best of {i} year {y}',{len(result)});
            '''
            mycursor.execute(create_playlist_sql)
            mydb.commit()
            search_playlist_sql = f'''select * from playlist where name='Best of {i} year {y}'
            '''
            mycursor.execute(search_playlist_sql)
            playlist = mycursor.fetchall()
            playlist_id = playlist[0][0]
            for it in result:
                insert_trackinplaylist_query = f'''
               insert into trackinplaylist values('{it[0]}','{playlist_id}');
            '''
                mycursor.execute(insert_trackinplaylist_query)
                mydb.commit()
            print(f"Add playlist Best of {i} year {y} successfully")
if __name__=="__main__":
    create_playlist_by_year()
    create_playlist_by_genre()
    create_playlist_mix()
