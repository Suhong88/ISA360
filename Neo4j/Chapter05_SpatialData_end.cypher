//We will import a dataset contains serveral points of interest in Manhattan (New York City)

//create a database

create databse spatialData

LOAD CSV WITH HEADERS FROM "https://raw.githubusercontent.com/Suhong88/ISA360/main/Neo4j/data/NYC_POI.csv" as row
CREATE (n:POI) set n.name=row.name,
                   n.latitude=toFloat(row.latitude),
                   n.longitude=toFloat(row.longitude),
                   n.point=point({latitude:toFloat(row.latitude), longitude: toFloat(row.longitude)})
                   
//list all POIs
match (p)
return p.name
order by p.name

//get the five closest points of interest from a given location (TIMES SQUARE POST STATION)

match (p1:POI {name: "TIMES SQUARE POST STATION"})
match (p2:POI)
where p2.name<>"TIMES SQUARE POST STATION"
with p2, distance(p1.point,p2.point) as distance_in_meters
return p2.name as name, round(distance_in_meters)
order by distance_in_meters
limit 5

//list the five closest points of interest from multiple locations

match (p1:POI)
where p1.name in ['TIMES SQUARE POST STATION', 'BEST BUY THEATER']
match (p2:POI)
where p1.name<>p2.name
with p1, p2, distance(p1.point,p2.point) as distance_in_meters
order by distance_in_meters
with p1.name as current_place, collect(p2.name+": "+round(distance_in_meters)) as places
return current_place, places[0..5] as nearby_places
limit 5


//Geocode- convert a textual address into a location

CALL apoc.spatial.geocodeOnce('1150 Douglas Pike, Smithfield RI 02917')
YIELD location
RETURN location.latitude, location.longitude

//reverseGeocode. Convert a location containing latitude and longitude into a textual address

CALL apoc.spatial.reverseGeocode(41.922091449999996, -71.53715173504338) 
YIELD location
RETURN location.description;

//load vaccine tweets with location into a graph

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

// add location to User node

CALL apoc.load.json("userwithTweetLocation.json")
YIELD value as row
merge (u:User {name:row._id})
set u.location=row.location

//add a point location to Tweet node:

match (t:Tweet)
set t.point=point({latitude:toFloat(t.latitude), longitude: toFloat(t.longitude)})

//add the location to Tweet node: (It will take a long time since Neo4j is contacting a OpenStreetMap API to obtain address information)

match (t:Tweet)
with toFloat(t.latitude) as latitude, toFloat(t.longitude) as longitude, t
CALL apoc.spatial.reverseGeocode(latitude, longitude) YIELD location
set t.location= location.description

// add the city to Tweet Node
match (t:Tweet)
with split(t.location, ",") as address, t
with address, t, size(address) as index
with  t, trim(address[index-4])+", "+trim(address[index-3]) as city
set t.city=city

//who tweeted the most
match (u:User)-[:TWEETED]->(t:Tweet)
return u.name, count(t) as numTweets
order by numTweets desc


// for CVSHealthJobs, show the loation of tweets by time line.

match (u:User {name:"CVSHealthJobs"})-[:TWEETED]-(t:Tweet)
return t.created_at as created_at, t.city
order by datetime(t.created_at)

match (u:User {name:"pairsonnalitesN"})-[:TWEETED]-(t:Tweet)
return t.created_at as created_at, t.city
order by datetime(t.created_at)

//for CVSHealthJobs, show the distance between two tweets sent

match (u:User {name:"CVSHealthJobs"})-[:TWEETED]-(t:Tweet)
with t
order by datetime(t.created_at)
with collect(t.point) as location
UNWIND range(0, size(location)-1) AS index
WITH location[index] AS currentLocation, location[index+1] AS nextLocation
return round(distance(currentLocation, nextLocation)*0.00062) as distance_in_miles

