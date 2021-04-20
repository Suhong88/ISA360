//We will import a dataset contains serveral points of interest in Manhattan (New York City)

//create a database

create databse spatialData

https://raw.githubusercontent.com/Suhong88/ISA360/main/Neo4j/data/NYC_POI.csv

LOAD CSV WITH HEADERS FROM "https://raw.githubusercontent.com/Suhong88/ISA360/main/Neo4j/data/NYC_POI.csv" as row
CREATE (n:POI) set n.name=row.name,
                   n.latitude=toFloat(row.latitude),
                   n.longitude=toFloat(row.longitude),
                   n.point=point({latitude:toFloat(row.latitude), longitude: toFloat(row.longitude)})
                   

//get the five closest points of interest from a given location.

match (n:POI)
match (s1:POI {name: "WINTER GARDEN THEATRE"})
with n, distance(n.point,point({latitude:s1.latitude, longitude:s1.longitude})) as distance_in_meters
return n.name, round(distance_in_meters)
order by distance_in_meters
limit 6

//Geocode- convert a textual address into a location

CALL apoc.spatial.geocodeOnce('1150 Douglas Pike, Smithfield RI 02917')
YIELD location
RETURN location.latitude, location.longitude

//reverseGeocode. Convert a location containing latitude and longitude into a textual address

CALL apoc.spatial.reverseGeocode(41.922091449999996, -71.53715173504338) 
YIELD location
RETURN location.description;

//load vaccine tweet with location into a graph

//need to set apoc.import.file.enabled=true in the apoc.conf

create database vaccine

//import user node
CALL apoc.load.json("userwithTweetLocation.json")
YIELD value as row
MERGE (u: User {name:row._id, followers:toInteger(row.followers), 
friends:toInteger(row.friends), favorites:toInteger(row.favorites)})

//import tweets, create relationships

CALL apoc.load.json("tweetWithLocation.json")
YIELD value as row
merge (u:User {name: row.user_name})
merge (t:Tweet {id:row.tweet_id, created_at:row.date["$date"], text:row.text,latitude:row.latitude,longitude:row.longitude})
merge (u)-[:TWEETED]->(t)

//who tweeted the most




//add a point location to Tweet node:



//add a location to Tweet node using reverseGeocode:




// add a city to Tweet Node




// for CVSHealthJobs, show the loation of tweets by time line.




//for CVSHealthJobs, show the distance between two tweets sent



