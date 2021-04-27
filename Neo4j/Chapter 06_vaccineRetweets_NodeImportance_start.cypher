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



//uses who have the highest number of retweets





//In_degree (top users who tweeted the most users).





//use who had the most tweets




//total degree




//page rank





//ArticleRank




//Eigenvector centrality




//Closeness Centrality




// Betweenness centrality

