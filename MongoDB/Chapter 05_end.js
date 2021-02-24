use sample_mflix

//create a copy of movies collection
db.movies.aggregate(
    [{
        $out: 'movies_copy'
    }]
)

//Deleting documents
//1. delete all movies where imdb rating is less than or equal to 2.
db.movies_copy.deleteMany(
    {"imdb.rating": {$lte: 2}}
)

//delete one with sort option
//2. remove a movie with a high number of IMDB votes (>50000), a low average rating of 3, and the least awards won.
db.movies_copy.findOneAndDelete(
    {"imdb.rating":{$lt:3},
    "imdb.votes": {$gt:50000}},
    {"sort": {"awards.won":1},
     "projection": {"title":1}}
)


//Updating Document with updatedOne()
//3.upate the movie Blacksmith Scene. change rate to PG-13 and year to 1894

db.movies_copy.find({"title": "Blacksmith Scene"})

db.movies_copy.updateOne(
    {"title": "Blacksmith Scene"},
    {$set: {"rated": "PG-13", "year": 1894}},
    {
        "returnNewDocument": true
    }
)

//update one document with additional options
//4. upate the movie Blacksmith Scene. Insert a new item latest into the document.

db.movies.findOneAndUpdate(
    {"title": "Blacksmith Scene"},
    {$set: {"latest": true}},
    {
        "returnNewDocument": true,
        "sort": {"_id": -1}
    }
)

//exercise 5.03 upate the imdb and tomatometer rating (page 254)
//5. upate imdb votes, viewer's rating and numbe of reviews.

db.movies_copy.find(
    {"title": "The Godfather"},
    {"imdb":1,"tomatoes.viewer": 1, "_id": 0} 
).pretty()

db.movies.findOneAndUpdate(
    {"title": "The Godfather"},
    {
        $set: {
            "imdb.votes": 1565120,
            "tomatoes.viewer.rating": 4.76,
            "tomatoes.viewer.numReviews": 733777
        }
    },
    {
    "projection": {"imdb": 1, "tomatoes.viewer": 1, "_id":0},
    "returnNewDocument": true
    }
)

//updating multiple documents with updateMany()
//6. for all UNRATED movies, change rated to Unrated

db.movies_copy.distinct("rated")

db.movies_copy.updateMany(
    {"rated": "UNRATED"},
    {$set: {"rated":"Unrated"}}
)


//increment $inc
//7. for The Godfather movie, increase viewer's rating by 1 and number of reviews by 10

db.movies.find({"title": "The Godfather"}).pretty()

db.movies.findOneAndUpdate(
    {"title":"The Godfather"},
    {$inc: {"tomatoes.viewer.rating": 1, "tomatoes.viewer.numReviews":10}},
    {returnNewDocument: true}
)

//multiply ($mul)
//8.for The Godfather movie, double the imdb rating
db.movies.findOneAndUpdate(
    {"title":"The Godfather"},
    {$mul: {"imdb.rating": 2}},
    {returnNewDocument: true}
)

//Rename ($rename)
//9. rename num_mflix_comments to comments and imdb.rating to rating

db.movies_copy.updateMany(
    {},
    {"$rename": {"num_mflix_comments": "comments", 
                "imdb.rating": "rating"
                 }},
    {returnNewDocument: true}
)

// 10.reanme can be used to move one field to and from nested documents.
db.movies_copy.updateMany(
    {},
    {$rename: {"rating": "imdb.rating"}},
    {returnNewDocument: true}
)

//current date #currentdate. Should not put quotation around created_date
//11. add a new movie with a title "Tomorrow Never Die" and created_date as current date

db.movies_copy.findOneAndUpdate(
    {"title": "Tomorrow Never Die"},
    {
      $currentDate: {
        created_date: true,
        "last_updated.date": { $type: "date" },
        "last_updated.timestamp": { $type: "timestamp" }
      }},
      {
          returnNewDocument: true
      }
)

db.movies_copy.findOneAndUpdate(
    {"title": "Tomorrow Never Die"},
    {
      $currentDate: {
        created_date: true,
        "last_updated.date": { $type: "date" },
        "last_updated.timestamp": { $type: "timestamp" }
      }},
      {
          returnNewDocument: true,
          upsert: true
      }
)

//removing fields ($unset)
// 12. remove created_date from Tomorrow Never Die
db.movies_copy.findOneAndUpdate(
    {"title": "Tomorrow Never Die"},
    {$unset: {
        "created_date": ""
    }},
    {returnnewDocument: true}
)

db.movies.find({"title": "Tomorrow Never Die"}).pretty()

//13. Remove imdb id from the movies collection

db.movies_copy.updateMany(
    {},
    {
        $unset: {
            "imdb.id": ""
        }
    }
)