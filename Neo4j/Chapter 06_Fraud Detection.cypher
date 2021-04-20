//Detecting fraud using Neo4j

CREATE (U1:User {id: "U1"})
CREATE (U2:User {id: "U2"})
CREATE (U3:User {id: "U3"})
CREATE (U4:User {id: "U4"})
CREATE (U5:User {id: "U5"})

CREATE (S1:Sale {id: "S1"})
CREATE (S2:Sale {id: "S2"})
CREATE (S3:Sale {id: "S3"})

CREATE (U1)-[:INVOLVED_IN]->(S1)
CREATE (U1)-[:INVOLVED_IN]->(S2)
CREATE (U2)-[:INVOLVED_IN]->(S3)
CREATE (U3)-[:INVOLVED_IN]->(S3)
CREATE (U4)-[:INVOLVED_IN]->(S3)
CREATE (U4)-[:INVOLVED_IN]->(S2)
CREATE (U5)-[:INVOLVED_IN]->(S2)
CREATE (U5)-[:INVOLVED_IN]->(S1)

//* Problem:
The idea behind the use of centrality algorithms such as PageRank in this context is as follows: given that I know that user 1 (U1) is a fraudster, 
can I identify their partner(s) in crime? To solve this issue, personalized PageRank with user 1 as the source node is a good solution to identify the users
that interact more often with user 1. *//

//In our auction fraud case, there is no direct relationship between users, but we still need to create a graph to run a centrality algorithm on.
//To create fake relationships between users, we consider them connected if they have joined at least one sale together.

//create a projected graph

call gds.graph.drop("projected_graph_cypher")

CALL gds.graph.create.cypher(
    "projected_graph_cypher", 
    "MATCH (u:User) 
        RETURN id(u) as id", 
    "MATCH (u:User)-[]->(p:Sale)<-[]-(v:User) 
        RETURN id(u) as source, id(v) as target, count(p) as weight"
)

//use personalized PageRank with this projected graph. Assuming we know U1 is a frauder.

MATCH (U1:User {id: "U1"})
CALL gds.pageRank.stream(
    "projected_graph_cypher", {
        relationshipWeightProperty: "weight", 
        sourceNodes: [U1]
    }
) YIELD nodeId, score
RETURN gds.util.asNode(nodeId).id as userId, round(score * 100)  / 100 as score
ORDER BY score DESC