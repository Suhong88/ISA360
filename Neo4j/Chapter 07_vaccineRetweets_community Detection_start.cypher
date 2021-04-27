/* Preparation steps:

1. Create a new project (Vaccine_Tweets_Network), use version 4.1.3
2. copy all files into the import folder of this project
3. make sure you install proper APOC and GDS Library
4. go to the setting, change maxt heap size to 5G: dbms.memory.heap.max_size=5G

//check below link for use neo4j bulk import
https://neo4j.com/docs/operations-manual/current/tools/neo4j-admin-import/

really important: do not put extra space in import script or header file
*/

//go to neo4j terminal shell, execute the following command to import vaccine tweets data. 

bin\neo4j-admin import --database=neo4j --delimiter="," --skip-bad-relationships=true --ignore-empty-strings=true --nodes import/user_node_header.csv,import/user_node.csv --nodes import/tweet_node_header.csv,import/tweet_node.csv --relationships import/retweet_edge_header.csv,import/retweet_edge.csv --relationships import/tweeted_edge_header.csv,import/tweeted_edge.csv


//create a named graph
CALL gds.graph.create.cypher(
    "myGraph", 
    "MATCH (u:User) 
        RETURN id(u) as id", 
    "MATCH (u1:User)-[r:IS_RETWEETED_BY]->(u2:User)
        RETURN id(u1) as source, id(u2) as target,  r.numRetweets as weight"
)

//weakly connected components






//Strongly connected components





//write the GDS results in the graph



//check number of users in each community




// Using the label propagation algorithm from the GDS




top 10 community based on label Propagation






//The Louvain algorithm





//Apply page rank to certain community

CALL gds.graph.create.cypher(
    "myGraph_community", 
    "MATCH (u1:User {modularity: 117158}) 
        RETURN id(u1) as id", 
    "MATCH (u1:User)-[r:IS_RETWEETED_BY]->(u2:User)
        RETURN id(u1) as source, id(u2) as target,  r.numRetweets as weight",
    {
     validateRelationships: false})




// User by number of devices

