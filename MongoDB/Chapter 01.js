//Chapter 01
//create a database
use chapter01;

//create a collection
db.createCollection("blogs")

//insert a document
db.blogs.insertOne({
    "username": "Art Smith",
    "noofblogs": 100,
    tags: ["Science", "Fiction"]
})

//insert multiple documents

db.blogs.insertMany([
    {"username": "Mary", "noofblogs": 120, "tags":["AI", "Deep Learning"]},
    {"username": "Bob", "noofblogs": 140, "tags":["Machine Learning", "Deep Learning"]},
    {"username": "Mike", "noofblogs": 120, "tags":["AI", "Big Data"]}
])