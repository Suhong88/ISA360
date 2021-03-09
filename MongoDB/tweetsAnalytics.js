//using MongoDB compass, create a database tweets and a collection vaccine_tweets
//import vaccine_tweets.json into vaccine_tweets
//switch to tweets database

//text search

//create an index based on the field you want to search.

db.vaccine_tweets.createIndex({text: "text"})

//$text operator

//find all tweets that include "Biden" or "Mask" in the text.

db.vaccine_tweets.find({$text: 
    {$search: "Biden Mask"}
},
    {"text":1,
    "created_at":1,
    "_id":0
}
).pretty()

//find all tweets that incldue "Social Distancing"

db.vaccine_tweets.find({$text: 
    {$search: "\"Social Distancing\""}
},
    {"text":1,
    "created_at":1,
    "_id":0
}
).pretty()


//find all tweets that incldue "Social Distancing" but not "Masks"

db.vaccine_tweets.find({$text: 
    {$search: "\"Social Distancing\" -Masks"}
},
    {"text":1,
    "created_at":1,
    "_id":0
}
).pretty()

//find all tweets that incldue "Social Distancing"
////sort the results in order by relevance score.

var pipeline= [
    {$match: {$text: 
        {$search: "\"Social Distancing\""}
    }},
    {$addFields: {score: {$meta: "textScore"}}},
    {$sort: {score:-1}},
    {$project:{
        "text":1,
        "score":1,
        "created_at":1
    }
    }
]

db.vaccine_tweets.aggregate(pipeline).pretty()

//find all tweets that incldue "Social Distancing" but not "Masks"

var pipeline= [
    {$match: {$text: 
        {$search: "\"Social Distancing\" -Masks"}
    }},
    {$addFields: {score: {$meta: "textScore"}}},
    {$sort: {score:-1}},
    {$project:{
        "text":1,
        "score":1,
        "created_at":1
    }
    }
]

db.vaccine_tweets.aggregate(pipeline).pretty()


//find top 10 hashtags 

db.vaccine_tweets.aggregate(pipeline).pretty()

var pipeline=[
    {$addFields: {"textArray": {$split: ["$text", " "]}}},
    {$unwind: "$textArray"},
    {$addFields: {"textArray": {$toLower: "$textArray"}}},
    {$match: {"textArray": {"$regex":"^#"}}},
    {$match: {"textArray": {$nin: ["#covid19", "#cov…", "#vaccine", "#coronavirus"]}}},
    {$group: {
        _id: {"hashtag": "$textArray"},
        "frequency": {$sum:1}
    }},
    {$sort: {"frequency":-1}},
    {$limit:10}
]

db.vaccine_tweets.aggregate(pipeline).pretty()


//show the tweets generated within five minutes
var pipeline=[{
    $addFields: {
        dateDifference: {
            $subtract: [new Date(), {
                $toDate: "$created_at"
            }]
        }
    }
}, 
{$match: {"dateDifference": {"$lt": 300000}}},
{$project: {
    "created_at":1,
    "text":1,
    "_id":0
}}
]

db.vaccine_tweets.aggregate(pipeline).forEach(printjson)

//#number of tweets by hour

var pipeline=[
     {$addFields: {
    hour: {$hour: {$toDate: "$created_at"}}
  }}, {$group: {
    _id: "$hour",
    count: {$sum:1}
  }}]

db.vaccine_tweets.aggregate(pipeline).forEach(printjson)