//Neo4j Cypher Manual v4.1
https://neo4j.com/docs/cypher-manual/4.1/

//put the file under import folder
ISA360_ClassInfo.csv
ISA360_ClassInfo_Modi.csv

//delete existing graph
match (n)
detach delete (n)


//load the full graph

load csv with headers from
"file:///ISA360_ClassInfo.csv" as row
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

//check name for mis-spelling

match (p:Person)
return distinct(p.name) as name
order by name

//check hobby for potential duplicates
match (h:Hobby)
return distinct(h.name)
order by h.name


//load the full grap again after cleaning hobbies and friends, 
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

// shwo all nodes with "" as name

match (p:Person {name: ""})
return p

//list all hobbies Suhong Li has
match (p: Person {name: "Suhong Li"})
return (p)-[:HAS_HOBBY]-()

//list all persons that has a hobby of Skiing
match (h: Hobby {name: "Skiing"})
return ()-[:HAS_HOBBY]->(h)


//list person who can skiing or skating

match (p: Person)-[r:HAS_HOBBY]->(h: Hobby)
WHERE h.name in ["Skating", "Skiing"]
return p.name

//count number of hobby each person has, list the person having the highest number of hobby first

match (p: Person)-[:HAS_HOBBY]->(h: Hobby)
return p.name as name, count(h.name) as NumberOfHobbies
Order by NumberOfHobbies desc

//list all hobbies by each person, list the person having the highest number of hobby first

match (p: Person)-[:HAS_HOBBY]->(h: Hobby)
return p.name as name, collect(h.name) as Hobbies
order by size(Hobbies) desc

//list friends of each person, display the person having the highest number of friends first

match (p: Person)-[:FRIEND_WITH]->(f: Person)
return p.name as name, collect(f.name) as Friends
order by size(Friends) desc

// add a relationship

merge (n)
merge (p1:Person {name: "Suhong Li"})
merge (p2:Person {name: "Kai-Jia Yue"})
merge (p3:Person {name: "Mitch Leahy"})
merge (p1)-[:FRIEND_WITH]-(p2)
merge (p1)-[:FRIEND_WITH]-(p3)

//list the friends of the friends of yourself

match (n:Person {name: ""})
detach delete n

match (p: Person {name: "Suhong Li"})-[:FRIEND_WITH]-(f: Person)-[:FRIEND_WITH]-(f1: Person)
where not (p)-[:FRIEND_WITH]->(f1)
return  p.name, f.name, f1.name


// I want to learn piano, help me find a friend who can play piano

match (p:Person {name: "Suhong Li"})-[r:FRIEND_WITH*1..3]-(p2)-[:HAS_HOBBY]->(h:Hobby {name: "Piano"})
return p2

// Find the person who share two hobbies. List the hobbies with most persons first.

match (p1:Person)-[:HAS_HOBBY]->(h1:Hobby)<-[:HAS_HOBBY]-(p2:Person)
match (p1:Person)-[:HAS_HOBBY]->(h2:Hobby)<-[:HAS_HOBBY]-(p2:Person)
where p1.name<>p2.name  and h1.name>h2.name
with h1.name+", "+h2.name as hobbies, collect(distinct(p1.name)) as name_list
return hobbies, name_list
order by size(name_list) desc

