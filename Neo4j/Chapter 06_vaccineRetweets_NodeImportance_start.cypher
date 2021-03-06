/* Preparation steps:

1. Create a new project (Vaccine_Tweets_Network), use version 4.1.3
2. copy all files into the import folder of this project
3. make sure you install proper APOC and GDS Library
4. go to the setting, change maxt heap size to 5G: dbms.memory.heap.max_size=5G

//check below link for the instruction for neo4j bulk import
https://neo4j.com/docs/operations-manual/current/tools/neo4j-admin-import/

really important: do not put extra space in import script or header file
*/

//go to neo4j terminal shell, execute the following command to import vaccine tweets data. 

bin\neo4j-admin import --database=neo4j --delimiter="," --skip-bad-relationships=true --ignore-empty-strings=true --nodes import/user_node_header.csv,import/user_node.csv --nodes import/tweet_node_header.csv,import/tweet_node.csv --relationships import/retweet_edge_header.csv,import/retweet_edge.csv --relationships import/tweeted_edge_header.csv,import/tweeted_edge.csv


//check degree centrality.

//Out-degree (top users who received retweets from the most users)

match (u1:User)-[r:IS_RETWEETED_BY]->(u2:User)
return u1.name, count(u2) as outDegree
order by outDegree desc
limit 10


//uses who have the highest number of retweets

match (u1:User)-[r:IS_RETWEETED_BY]->(u2:User)
return u1.name, sum(r.numRetweets) as outDegree
order by outDegree desc
limit 10

//In_degree (top users who tweeted the most users).

match (u1:User)-[r:IS_RETWEETED_BY]->(u2:User)
return u2.name, count(u1) as inDegree
order by inDegree desc
limit 10

//use who had the most tweets

match (u1:User)-[r:IS_RETWEETED_BY]->(u2:User)
return u2.name, sum(r.numRetweets) as inDegree
order by inDegree desc
limit 10

//total degree

match (u1:User)-[r:IS_RETWEETED_BY]-(u2:User)
return u2.name, count(u1) as numUsers
order by numUsers desc
limit 10

match (u1:User)-[r:IS_RETWEETED_BY]-(u2:User)
return u2.name, sum(r.numRetweets) as numRetweets
order by numRetweets desc
limit 10

//page rank





//ArticleRank




//Eigenvector centrality




//Closeness Centrality




// Betweenness centrality

