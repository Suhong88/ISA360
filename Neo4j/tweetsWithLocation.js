//extract tweets with location
var pipeline=[
    {$match: {"geo": {$ne:null}}},
    {$addFields: {
        date: {$toDate: "$created_at"}}},
    {$project: {
        "date": "$date",
        "tweet_id":"$id_str",
        "user_name": "$user.screen_name",
        "text":"$text",
        "latitude": {$arrayElemAt: ["$geo.coordinates", 0]},
        "longitude": {$arrayElemAt: ["$geo.coordinates", 1]},
        "_id":0
    }},
  // {$limit:10}
  {$out: "tweetWithLocation"}
]

db.vaccine_tweets.aggregate(pipeline).forEach(printjson)

//extract user for the above tweets
var pipeline=[
    {$match: {"geo": {$ne:null}}},
    {$addFields: {
        date: {$toDate: "$created_at"}}},
    {$sort: {"date":-1}},
    {$group: {
        "_id": "$user.screen_name",
        "location": {$first:"$user.location"},
        "followers": {$max:"$user.followers_count"},
        "friends":  {$max:"$user.friends_count"},
        "favorites": {$max: "$user.favourites_count"}
    }},
  // {$limit:10}
   {$out: "userwithTweetLocation"}
]

db.vaccine_tweets.aggregate(pipeline).forEach(printjson)