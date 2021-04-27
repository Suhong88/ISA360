//Computing degree centrality

//create a small graph

CREATE (A:Node {name: "A"})
CREATE (B:Node {name: "B"})
CREATE (C:Node {name: "C"})
CREATE (D:Node {name: "D"})

CREATE (A)-[:LINKED_TO {weight: 1}]->(B)
CREATE (B)-[:LINKED_TO]->(A)
CREATE (A)-[:LINKED_TO]->(D)
CREATE (C)-[:LINKED_TO]->(B)
CREATE (D)-[:LINKED_TO]->(B)

//out-degree

MATCH (n:Node)-[r:LINKED_TO]->()
RETURN n.name, count(r) as outgoingDegree
ORDER BY outgoingDegree DESC

//In-degree
MATCH (n:Node)<-[r:LINKED_TO]-()
RETURN n.name as nodeName, count(r) as incomingDegree
ORDER BY incomingDegree DESC

//the centrality result is missing from node C, which is not connected to any other node. This can be fixed using OPTIONAL MATCH, like this:

MATCH (n:Node)
OPTIONAL MATCH (n)<-[r:LINKED_TO]-()
RETURN n.name as nodeName, count(r) as incomingDegree
ORDER BY incomingDegree DESC

//total-degree

MATCH (n)-[r:LINKED_TO]-()
RETURN n.name as nodeName, count(r) as TotalDegree
ORDER BY TotalDegree DESC


//Computing the outgoing degree using GDS

// Using an anonymous projected graph. The projected graph will be generated on the fly when calling the GDS procedure.

//total degree:

CALL gds.alpha.degree.stream(
    {
        nodeProjection: "Node", 
        relationshipProjection: {
            LINKED_TO: {
                type: "LINKED_TO", 
                orientation: "UNDIRECTED"
            }
        }
    }
) YIELD nodeId, score
RETURN gds.util.asNode(nodeId).name as nodeName, score as total_degree
ORDER BY total_degree DESC

// out-degree

CALL gds.alpha.degree.stream(
    {
        nodeProjection: "Node", 
        relationshipProjection: {
            LINKED_TO: {
                type: "LINKED_TO", 
                orientation: "NATURAL"
            }
        }
    }
) YIELD nodeId, score
RETURN gds.util.asNode(nodeId).name as nodeName, score as in_degree
ORDER BY in_degree DESC

//in-degree

CALL gds.alpha.degree.stream(
    {
        nodeProjection: "Node", 
        relationshipProjection: {
            LINKED_TO: {
                type: "LINKED_TO", 
                orientation: "REVERSE"
            }
        }
    }
) YIELD nodeId, score
RETURN gds.util.asNode(nodeId).name as nodeName, score as out_degree
ORDER BY out_degree DESC

//Using GDS to assess PageRank centrality in Neo4j

//define a named graph (directed)

CALL gds.graph.create("projected_graph", "Node", "LINKED_TO")

CALL gds.pageRank.stream("projected_graph", {}) 
YIELD nodeId, score
RETURN gds.util.asNode(nodeId).name as nodeName, score
ORDER BY score DESC

Rank
//ArticleRank is a variant of PageRank whereby the chance of assuming that a link coming from a page with a few outgoing links is more important than others is smaller.

CALL gds.alpha.articleRank.stream("projected_graph", {})
YIELD nodeId, score
RETURN gds.util.asNode(nodeId).name as name, score
ORDER BY score DESC

//Personalized PageRank
//more weight is given to some user-defined nodes. For instance, giving a higher importance to node A can be achieved with this query:

MATCH (A:Node {name: "A"})
CALL gds.pageRank.stream("projected_graph", {
  sourceNodes: [A]
})
YIELD nodeId, score
RETURN gds.util.asNode(nodeId).name AS nodeName, round(score*100)/100 as score
ORDER BY score DESC

//Eigenvector centrality

CALL gds.alpha.eigenvector.stream("projected_graph", {}) 
YIELD nodeId, score as score
RETURN gds.util.asNode(nodeId).name as nodeName, score
ORDER BY score DESC

//path-based centrality metrics
//Closeness centrality measures how close a node is, on average, to all the other nodes in the graph. It can be seen as centrality from a geometrical point of view.

//Computing closeness from the shortest path algorithms

//create the projected graph

CALL gds.graph.create("projected_graph_undirected_weight", "Node", {
          LINKED_TO: {
            type: "LINKED_TO",
            orientation: "UNDIRECTED",
            properties: {
                  weight: {
                    property: "weight",
                    defaultValue: 1.0
                  }
            }
        }
    }
)

//shortest path from node A to the rest of the nodes

MATCH (startNode:Node {name: "A"})
CALL gds.alpha.shortestPath.deltaStepping.stream(
    "projected_graph_undirected_weight", 
    {
        startNode: startNode, 
        delta: 1, 
        relationshipWeightProperty: 'weight'
    }
) YIELD nodeId, distance
RETURN gds.util.asNode(nodeId).name as nodeName, distance

// calculate the distance of each node to other nodes:
MATCH (startNode:Node)
CALL gds.alpha.shortestPath.deltaStepping.stream(
    "projected_graph_undirected_weight", 
    {
        startNode: startNode, 
        delta: 1, 
        relationshipWeightProperty: 'weight'
    }
) YIELD nodeId, distance
RETURN startNode.name as node, (COUNT(nodeId) - 1)/SUM(distance) as d
ORDER BY d DESC

// You may call GDS functions to get the same result.

CALL gds.alpha.closeness.stream("projected_graph_undirected_weight", {}) 
YIELD nodeId, centrality as score
RETURN gds.util.asNode(nodeId).name as nodeName, score
ORDER BY score DESC

// Betweenness centrality
// Measure the number of shortest paths traversing a given node

CALL gds.betweenness.stream("projected_graph_undirected_weight", {})
YIELD nodeId,  score
RETURN gds.util.asNode(nodeId).name, score
ORDER BY score DESC
