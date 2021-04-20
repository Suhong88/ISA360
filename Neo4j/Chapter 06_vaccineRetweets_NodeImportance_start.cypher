Vaccine_RETWEETS

//Create a new project for this assignment

// copy all files into the import folder of this project
// make sure you install proper APOC and GDS Library
//go to the setting, change maxt heap size to 5G: dbms.memory.heap.max_size=5G

//go to cypher shell, execute the following code. Need to have all the codes in one line. Use default database neo4j

bin\neo4j-admin import --database=neo4j --delimiter="," --skip-bad-relationships=true --nodes import/user_node_header.csv,import/user_node.csv --relationships import/IS_RETWEETED_BY_edge_header.csv,import/IS_RETWEETED_BY_edge.csv

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

