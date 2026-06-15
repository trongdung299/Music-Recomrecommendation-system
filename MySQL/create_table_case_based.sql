create table case_based (
	caseid int auto_increment primary key,
    genres varchar(500),
    artist_favourite_id varchar(250)
);
drop table case_based;
select * from case_based;

ALTER TABLE case_based 
ADD COLUMN score FLOAT NOT NULL DEFAULT 0;

ALTER TABLE case_based ADD COLUMN score FLOAT NULL;

UPDATE case_based SET score = 0;