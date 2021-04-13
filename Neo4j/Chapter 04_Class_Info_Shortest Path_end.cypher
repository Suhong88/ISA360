//To find the name of a procedure

call gds.list()
yield name, description, signature
where name=~".*shortestPath.*"
return name, description, signature


//make sure that you have ISA360_ClassInfo_Modi.csv under the import folder of this project.

load csv with headers from
"file:///ISA360_ClassInfo_Modi.csv" as row
with row.Name as full_name, row.Hometown as hometown, row.Language as language, split(row.Hobbies, ",") as hobbies, split(row.Pets, ",") as pets, split(row.Friends, ",") as friends
MERGE (p: Person {name: full_name, hometown: hometown, favorite_language: language})
with p, hobbies, pets, friends
unwind hobbies as hobby
with p, hobby, pets, friends
unwind pets as pet
with p, hobby, pet, friends
unwind friends as friend
with p, hobby, pet, friend
MERGE(h: Hobby {name: trim(hobby)})
MERGE (p) -[: HAS_HOBBY]->(h)
MERGE(pt: Pet {name: trim(pet)})
MERGE (p) -[:HAS_PET]->(pt)
MERGE (f: Person {name: trim(friend)})
MERGE (p)-[:FRIEND_WITH]-(f)

// add two relationships

merge (n)
merge (p1:Person {name: "Suhong Li"})
merge (p2:Person {name: "Kai-Jia Yue"})
merge (p3:Person {name: "Mitch Leahy"})
merge (p1)-[:FRIEND_WITH]-(p2)
merge (p1)-[:FRIEND_WITH]-(p3)

// remove the node without name

match (n:Person {name: ""})
detach delete n

//shortest path. What is the degree of seperation between two person

CALL gds.graph.create("myGraph", "Person", "FRIEND_WITH")

MATCH (p1:Person {name: "Suhong Li"})
MATCH (p2:Person {name: "Max Paul"})
CALL gds.alpha.shortestPath.stream("mygraph", {startNode: p1, endNode: p2})
YIELD nodeId, cost
RETURN gds.util.asNode(nodeId).name as name, cost

//undirected

CALL gds.graph.create("myGraphUndirected", "Person", {
          FRIEND_WITH: {
            type: "FRIEND_WITH",
            orientation: "UNDIRECTED"
       }}
)

MATCH (p1:Person {name: "Suhong Li"})
MATCH (p2:Person {name: "Max Paul"})
CALL gds.alpha.shortestPath.stream("myGraphUndirected", {startNode: p1, endNode: p2})
YIELD nodeId, cost
RETURN gds.util.asNode(nodeId).name as name, cost

// anonymous graph

MATCH (p1:Person {name: "Suhong Li"}),
      (p2:Person{name: "Max Paul"})
CALL gds.alpha.shortestPath.stream({
  startNode: p1,
  endNode: p2,
  nodeProjection: "*",
  relationshipProjection: {
    all: {
      type: "*",
      orientation:  "UNDIRECTED"
    }
  }
})
YIELD nodeId, cost
RETURN gds.util.asNode(nodeId).name AS name, cost;

// What is the least degree seperation from me to other person

//set weight to 1 for all relationships

match (p1)-[r:FRIEND_WITH]-(p2)
set r.weight=1

//create a weighted graph

CALL gds.graph.create("myGrapgUndirectedWeighted", "Person", {
          FRIEND_WITH: {
            type: "FRIEND_WITH",
            orientation: "UNDIRECTED",
            properties: {
                  weight: {
                    property: "weight",
                    defaultValue: 1.0
                  }
            }
       }}
)

MATCH (p:Person {name: "Suhong Li"})
CALL gds.alpha.shortestPath.deltaStepping.stream("myGrapgUndirectedWeighted", {
        startNode: p, 
        relationshipWeightProperty: "weight", 
        delta: 1
    }
)
YIELD nodeId, distance
RETURN gds.util.asNode(nodeId).name, distance
order by distance

