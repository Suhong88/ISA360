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




//check hobby for potential duplicates





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




//list all hobbies I have




//list all persons that has a hobby of Skiing




//list person who can skiing or skating




//count number of hobby each person has, list the person having the highest number of hobby first





//list all hobbies by each person, list the person having the highest number of hobby first






//list friends of each person, display the person having the highest number of friends first





// add a friend of yours to the graph





//list the friends of the friends of yourself





// I want to learn piano, help me find a friend who can play piano






// Find the person who share two hobbies 





