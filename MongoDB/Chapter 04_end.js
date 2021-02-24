//Chpater 4. Querying Document

//find a document with a condition
//1. find all comments made by Cameron Duran. Display name and date.
db.comments.find(
    {"name": "Cameron Duran"},
    {"name":1, "date": 1}
)

// exclude _id in the result
db.comments.find(
    {"name": "Cameron Duran"},
    {"name":1, "date": 1, "_id":0}
)


//save results into a variable and use next() to display next one
var comments=db.comments.find(
    {"name": "Cameron Duran"},
    {"name":1, "date": 1, "_id":0}
)


// finding the distinct fields
//2. How many rated category in movies collection?
db.movies.distinct("rated")

//3. find all rated category that were released in 1994

db.movies.distinct("rated", {"year": 1994})


// counting the documents. It will not physically count the documents. Instead, it will read through the collection's
// metadata and return the count

//4. Count number of the movies
db.movies.count()


// count all movies are released in 1994

db.movies.count({"year": 1994})

// do an exact count

db.movies.countDocuments({"year": 1994})

//conditional operators: $eq, $ne, $gt, $gte, $lt, $lte
//5. Find the numbe of the movies that have less than 5 comments.
db.movies.find(
    {"num_mflix_comments": {$lt:5}},
    {"title":1, "num_mflix_comments":1, "_id":0}
)

//6.  find all movies released in the 21st century (since January 1,2000). Display title and released year.
db.movies.find(
    {"released": {$gte: new Date('2000-01-01')}},
    {"title":1, "released":1, "_id":0}
)

//in $in and not in $nin
// 7. find all movies with a rated category of G, PG or PG-13.
db.movies.find(
    {"rated": {$in: ["G", "PG", "PG-13"]}},
    {"rated":1}
)

//8. Find all unrated movies in 2008.
db.movies.find(
    {$and:[
        {"rated": "Unrated"},
        {"year": 2008}
    ]},
    {
        "title":1,
        "rated":1,
        "year":1,
        "_id":0
    }
)

//implicit and

db.movies.find(
    {"rated": "UNRATED", 
     "year": 2008},
    {
        "title":1,
        "rated":1,
        "year":1,
        "_id":0
    }
)

// logical operators $and, $or, $nor, $not
//9. find all movies where Leonardo DiCaprio is a cast member, Martin Scorsese is a director, is in either Drama or Crime genres.
// display title, year, cast, directors and genres.
db.movies.find(
    {
        $and:[
            {"cast":"Leonardo DiCaprio"},
            {"directors": "Martin Scorsese"},
            {$or:[
                {"genres": "Drama"},
                {"genres": "Crime"}
            ]
            }
        ]
    },
    {
        "title":1,
        "cast":1,
        "directors":1,
        "genres":1,
        "_id":0
    }
)

//implict and

db.movies.find(
    {
      "cast":"Leonardo DiCaprio",
      "directors": "Martin Scorsese",
       $or:[
                {"genres": "Drama"},
                {"genres": "Crime"}
            ]
     },     
    {
        "title":1,
        "cast":1,
        "directors":1,
        "genres":1,
        "_id":0
    }
)
//Regular Expressions. It is case sensitive
//10. Find all movies where title includes Opera

db.movies.find(
    {
        "title": {$regex: "Opera"}
    },
    {
        "title":1,
        "_id":0
    }
)

//using the caret(^) operator

db.movies.find(
    {
        "title": {$regex: "^Opera "}
    },
    {
        "title":1,
        "_id":0
    }
)

//using the dollar($) operator
db.movies.find(
    {
        "title": {$regex: "Opera$"}
    },
    {
        "title":1,
        "_id":0
    }
)

db.movies.find(
    {
        "title": {$regex: " Opera "}
    },
    {
        "title":1,
        "_id":0
    }
)

//11. find all movies where title starts with two numbers

db.movies.find(
    {
        "title": {$regex: "^[0-9][0-9]"}
    },
    {
        "title":1,
        "_id":0
    }
)


//12. find all movies starting with number and include word Street

db.movies.find(
    {$and:[
        {"title": {$regex:"^[0-9]"}},
        {"title": {$regex:"Street"}}
    ]},
    {
        "title":1,
        "_id":0
    }
)


//query arrays and nested documents
//finding an array by an element
//13. find all movies where Charles Chaplin and Edna Purviance are cast members.
db.movies.find({
    "cast": {$all:
        ["Charles Chaplin", "Edna Purviance"]}
},
{
    "cast":1,
    "_id":0
}
)


//Projecting Array Elements using $
// 14. find all movies where genre is Drama.

db.movies.find(
    {
    "genres": "Drama"},
    {
        "genres":1,
        "title":1,
        "_id":0
    }
)


//display the first matching element.

db.movies.find(
    {
    "genres": "Drama"},
    {
        "genres.$":1,
        "title":1,
        "_id":0
    }
)


//Projecting matching elements by their index position ($slice)
//15. display movie titled Youth without youth
db.movies.find(
    {
        "title": "Youth Without Youth"
    },
    {
        "genres":1,
        "title":1,
        "_id":0
    }
)



//return the first two elements

db.movies.find(
    {
        "title": "Youth Without Youth"
    },
    {
        "genres":{$slice:2},
        "title":1,
        "_id":0
    }
)


//return the last two elements only

db.movies.find(
    {
        "title": "Youth Without Youth"
    },
    {
        "genres":{$slice:-2},
        "title":1,
        "_id":0
    }
)


//starting at second element and pick 2

db.movies.find(
    {
        "title": "Youth Without Youth"
    },
    {
        "genres":{$slice:[1,2]},
        "title":1,
        "_id":0
    }
)

//Query nested objects
// sorting documents. 1: ascending, -1: descending
// 16. Find movies that have won at least 10 awards and received 6 nominations. Display awards and title. Only show top 5.
db.movies.find(
    {
        "awards.wins": {$gt:10},
        "awards.nominations":6
    },
    {
        "title":1,
        "awards":1,
        "_id":0
    }
).sort({"awards.wins":-1}).limit(5).pretty()



//17. Display all movies where Charles Chaplin is a cast memeber. Display title, awards win and genres. 
//sort by the first element in genre and then awards win.

db.movies.find({
    "cast": "Charles Chaplin"
}, {
    "title":1,
    "awards.wins":1,
    "genres":1,
    "_id":0
}
).sort({"genres.0":1, "awards.wins":-1})


//Activity 4.0.1
//finding movies by genre and paginating results
// Activity 4.01: Finding Movies by Genre and Paginate Results

var genre = "Action"
var pageSize = 5

function findMoviesByGenre(genre, pageSize){
    
    var result = db.movies.find(
        {"genres" : genre},
        {"_id" : 0, "title" :1, "genres":1}).
        sort({"imdb.rating" : -1}).
        limit(pageSize).
        toArray()

    return result
}

//call function

findMoviesByGenre("Drama", 5)

drama= findMoviesByGenre("Drama", 5)