//Creating aggregations functions

var simpleFind= function() {
print("Find Result:")
db.theaters.find(
    {"location.address.state": "MN"},
    {"location.address.city": 1})
    .sort({"location.address.city": 1})
    .limit(3)
    .forEach(printjson)
}

//create aggregation
var simpleFindAggrgate=function(){
    print("aggregation Result:")
    var pipeline=[
        {$match: {"location.address.state": "MN"}},
        {$project: {"location.address.city": 1}},
        {$sort: {"location.address.city": 1}},
        {$limit: 3}
    ];
    db.theaters.aggregate(pipeline).forEach(printjson)
};

simpleFindAggrgate();

/*find top 3 movies based on imdb rating for all movies
in romantic category and released before 2001. 
Display title, genres, released, and imdb.rating*/

var pipeline=[
    {$sort: {"imdb.rating": -1}},
    {$match: {
        genres: "Romance",
        released: {$lte: new ISODate("2001-01-01T00:00:00Z")}
    }},
    {$project: {"_id":0, "title":1, "genres":1, "released":1, "imdb.rating":1}},
    {$limit: 3}
];

db.movies.aggregate(pipeline);

//better sequence

var pipeline=[
    {$match: {
        genres: {$in: ["Romance"]},
        released: {$lte: new ISODate("2001-01-01T00:00:00Z")}
    }},
    {$sort: {"imdb.rating": -1}},
    {$limit: 3},
    {$project: {"_id":0, "title":1, "genres":1, "released":1, "imdb.rating":1}},
];

db.movies.aggregate(pipeline);

//The Group Stage
//2. Display number of titles/movies by rated category.

var pipeline =[{
    $group: {
        _id: "$rated",
        "numTitles": {$sum: 1},
    }
}
];

db.movies.aggregate(pipeline)

//3. Display top 5 rated category based on number of movies
var pipeline =[{
    $group: {
        _id: "$rated",
        "numTitles": {$sum: 1},
    }},
    {
        $sort: {"numTitles":-1}
    },
    {
        $limit: 5
    }
];

db.movies.aggregate(pipeline)

//remove null

var pipeline =[
    {
        $match: {"rated": {$ne: null}}
    },
    {
    $group: {
        _id: "$rated",
        "numTitles": {$sum: 1},
    }},
    {
        $sort: {"numTitles":-1}
    },
    {
        $limit: 5
    }
];

db.movies.aggregate(pipeline)

//dispaply total run time and average run time by rated

var pipeline =[
    {
        $match: {"rated": {$ne: null}}
    },
    {
    $group: {
        _id: "$rated",
        "numTitles": {$sum: 1},
        "totalRunTime": {$sum: "$runtime"},
        "averageRunTime": {$avg: "$runtime"}
    }},
    {
        $sort: {"numTitles":-1}
    },
    {
        $limit: 5
    }
];

db.movies.aggregate(pipeline)


//format average run time as integer

var pipeline =[
    {
        $match: {"rated": {$ne: null}}
    },
    {
    $group: {
        _id: "$rated",
        "numTitles": {$sum: 1},
        "totalRunTime": {$sum: "$runtime"},
        "averageRunTime": {$avg: "$runtime"}
    }},
    {
        $sort: {"numTitles":-1}
    },
    {
        $limit: 5
    },
    {
        $project: {
            "roundedAvgRunTime": {$trunc: "$averageRunTime"},
            "numTitles":1,
            "totalRunTime":1
        }
    }
];

db.movies.aggregate(pipeline)

//Exercise 7.03 Manipulating Data
/* for only movies older than 2001, find the average and maximum popularity
(defined by the IMDB rating) for each genre, sort the genre by popularity, 
and find the adjusted (with trailers) runtime of the longest movie in each genre.
trailers run for 12 minutes before any film.
*/

var pipeline=[
        {$match: {released: {$lte: new ISODate("2001-01-01")}}},
        {
            $group: {
                _id: {"$arrayElemAt": ["$genres", 0]},
                "popularity": { $avg: "$imdb.rating"},
                "top_movie": { $max: "$imdb.rating"},
                "longest_runtime": {$max: "$runtime"}
            }
        },
        { $sort: {"popularity":-1}},
        { $project: {
            _id: 1,
            popularity:1,
            top_movie: 1,
            adjusted_runtime: {$add: [ "$longest_runtime",12]}
        }
        },
        {$limit:5}
]

// db.movies.aggregate(pipeline)

db.movies.aggregate(pipeline).forEach(printjson)

//What is the most popular genre?

var pipeline=[
    {$unwind: "$genres"},
    {$group: {
        _id:"$genres",
        "count": {$sum:1}
    }
    },
    {$sort: {"count":-1}},
    {$limit:5}
  ]

db.movies.aggregate(pipeline).forEach(printjson);

// modify the above query. Each movie can represent multiple genres. 
//format popularity with two decimal places.

var pipeline=[
    {$match: {released: {$lte: new ISODate("2001-01-01")}}},
    {$unwind: "$genres"},
    {
        $group: {
            _id: "$genres",
            "popularity": { $avg: "$imdb.rating"},
            "top_movie": { $max: "$imdb.rating"},
            "longest_runtime": {$max: "$runtime"}
        }
    },
    { $sort: {"popularity":-1}},
    { $project: {
        _id: 1,
        popularity: {$round: ["$popularity", 2]},
        top_movie: 1,
        adjusted_runtime: {$add: [ "$longest_runtime",12]}
    }
    },
    {$limit:5}
]

db.movies.aggregate(pipeline).forEach(printjson)


/*find the best title from each of the top genre for the movies older than 2001,
  run time is less than 200 and rating is over 7.0
*/

var pipeline=[
    {$match: {released: {$lte: new ISODate("2001-01-01")},
             "runtime": {$lt:200},
             "imdb.rating": {$gte: 7.0}}
    },
    {$unwind: "$genres"},
    {$sort: {"imdb.rating":-1}},
    {
        $group: {
            _id: "$genres",
            "popularity": { $avg: "$imdb.rating"},
            "top_movie": { $max: "$imdb.rating"},
            "longest_runtime": {$max: "$runtime"},
            "best title": {$first: "$title"},
            "best_rating": {$first: "$imdb.rating"}
        }
    },
    { $sort: {"popularity":-1}},
    {$limit:5}
]

/* Find top 5 titles within each genre based on imdb rating for the movies older than 2001,
  run time is less than 200 and rating is over 7.0
*/

var pipeline=[
    {$match: {released: {$lte: new ISODate("2001-01-01")},
             "runtime": {$lt:200},
             "imdb.rating": {$gte: 7.0}}
    },
    {$unwind: "$genres"},
    {$sort: {"imdb.rating":-1}},
    {
        $group: {
            _id: "$genres",
            "popularity": { $avg: "$imdb.rating"},
            "top_movie": { $max: "$imdb.rating"},
            "longest_runtime": {$max: "$runtime"},
            "titles": {$push: {title: "$title", rating: "$imdb.rating"}}        
    }},
    { $sort: {"popularity":-1}},
    {$limit:5},
    { $project: {
        _id: 1,
        popularity: {$round: ["$popularity", 2]},
        top_movie: 1,
        adjusted_runtime: {$add: [ "$longest_runtime",12]},
        "top_5_titles": {$slice: ["$titles", 0, 5]}}
    }
]

db.movies.aggregate(pipeline).forEach(printjson)

