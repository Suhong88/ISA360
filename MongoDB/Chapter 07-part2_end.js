//Aggregation Pipeline
//Find top 10 words in title of all movies

var pipeline=[{
    $addFields: {
        "titleArray": {$split:["$title", " "]}
    }},
    {$unwind: "$titleArray"},
    {$group: {
        _id: {"word": "$titleArray"},
        count: {$sum:1}
    }},
    {$sort: {"count":-1}},
    {$limit: 10}
]

db.movies.aggregate(pipeline).forEach(printjson);


//fine top 10 words in title for all movies for each genre

var pipeline=[{
    $project: {
        "titleArray": {$split:["$title", " "]},
        "genre": {$arrayElemAt: ["$genres", 0]}},
    },
    {$unwind: "$titleArray"},
    {$group: {
        _id: {"genre": "$genre", "word": "$titleArray"},
        count: {$sum:1}
    }},
    {$sort: {"count":-1}},
    {$group: {
        _id: "$_id.genre",
        "words": {$push: {"word": "$_id.word", "count": "$count"}}
    }},
    { $project: {
        _id: 1,
       "genre": 1,
        "top_10_words": {$slice: ["$words", 0, 10]}}
    }
]

db.movies.aggregate(pipeline).forEach(printjson);


//use sample to speed up your query while you are testing

var pipeline=[
    {$sample: {size:1000}},
    {$project: {
        "titleArray": {$split:["$title", " "]},
        "genre": {$arrayElemAt: ["$genres", 0]}},
    },
    {$unwind: "$titleArray"},
    {$group: {
        _id: {"genre": "$genre", "word": "$titleArray"},
        count: {$sum:1}
    }},
    {$sort: {"count":-1}},
    {$group: {
        _id: "$_id.genre",
        "words": {$push: {"word": "$_id.word", "count": "$count"}}
    }},
    { $project: {
        _id: 1,
       "genre": 1,
        "top_10_words": {$slice: ["$words", 0, 10]}}
    }
]

db.movies.aggregate(pipeline).forEach(printjson);


//joining collections with $lookup
//find the comments made by Catelyn Stark and Ned Stark

var pipeline=[
   { $match: {$or: [{"name": "Catelyn Stark"},
                       {"name": "Ned Stark"}                      
    ]}},
    {
        $lookup: {
            from: "comments",
            localField: "name",
            foreignField: "name",
            as: "Comments"
        }
    },
    {$limit:2}
    ];
    
db.users.aggregate(pipeline).forEach(printjson);


//unwind the comments

var pipeline=[
    { $match: {$or: [{"name": "Catelyn Stark"},
                        {"name": "Ned Stark"}                      
     ]}},
     {
         $lookup: {
             from: "comments",
             localField: "name",
             foreignField: "name",
             as: "comments"
         }
     },
     {$unwind: "$comments"},
     {$limit:2}
     ];
     
 db.users.aggregate(pipeline).forEach(printjson);

 //display number of comments made by uers by year.

 var pipeline=[
     {$addFields: {
         "year": {$year: "$date"}
     }},
     {$group: {
         _id: "$year",
         total_comments: {$sum:1}
     }},
     {$sort: {"_id":1}}
 ]

 db.comments.aggregate(pipeline).forEach(printjson);

//outputting your results with $out and $merge
//Exercise 7.05: Listing the most user-commented movies

var findMostCommentedMovies =function(){
    print("Finding the most commented on movies");
    var pipeline=[
        {$sample:{size: 5000}},
        {$group: {
            _id: "$movie_id",
            "sumComments": {$sum:1}
        }},
        {$sort: {
            "sumComments": -1
        }},
        { $limit: 5},
        {$lookup: {
            from: "movies",
            localField: "_id",
            foreignField: "_id",
            as: "movie"
        }},
       {$unwind: "$movie" },
      {$project: {
          "movie.title":1,
          "movie.imdb.rating": 1,
          "sumComments": 1
      }},
       {$out: "most_commented_movies"}
    ];
    
    db.comments.aggregate(pipeline).forEach(printjson);
};

findMostCommentedMovies();

// Activity 7.01: putting aggregations into practice
/* 
    For each genre, which movie has the most award nominations, given that they have won at least one of these nominations?
    For each of these movies, what is their appended runtime, given that each movie has 12 minutes of trailers before it?
    An example of the sorts of things users are saying about this film.
    Because this is a classic movie marathon, only movies released before 2001 are eligible.
    Across all genres, list all the genres that have the highest number of award wins.
*/

var chapter7Activity= function(){
    var pipeline=[
       {$match: {
            released:{$lte: new ISODate("2001-01-01T00:00:00Z")},
            "awards.wins": {$gte: 1}
         }
        },
        {$sort: {
            "awards.nominations": -1
        }},
        {$group: {
            _id: {"$arrayElemAt": ["$genres", 0]},
            "film_id": {$first: "$_id"},
            "film_title": {$first: "$title"},
            "film_awards": {$first: "$awards"},
            "film_runtime": {$first: "$runtime"},
            "genre_award_wins":{$sum: "$awards.wins"}
        }},
        {$lookup: {
            from: "comments",
            localField: "film_id",
            foreignField: "movie_id",
            as: "comments"
        }},
        {$project: {
            film_id: 1,
            film_title: 1,
            film_awards: 1,
            film_runtime: { $add: ["$film_runtime", 12]},
            genre_award_wins: 1,
           "comments": {$slice: ["$comments", 1]}
        }},
        {$sort: {
            "genre_award_wins": -1
        }},
        {$limit: 3}
    ];
    db.movies.aggregate(pipeline).forEach(printjson);
};

chapter7Activity();






