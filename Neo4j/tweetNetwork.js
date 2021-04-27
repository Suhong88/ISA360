//extract user information

var pipeline=[
    // {$match: {"retweeted_status.user.screen_name": {$ne:null}}},
    // {$match: {"user.location": {$ne:null}}},
     {$addFields: {
         year: {$year: {$toDate: "$user.created_at"}}}},
     {$project:{
         "user":"$user.screen_name",
         "location": "$user.location",
         "followers": "$user.followers_count",
         "friends": "$user.friends_count",
         "favorites": "$user.favourites_count",
        "joining_year": "$year"
      }},
      {$group: {
         _id:"$user",
         "location": {$first:"$location"},
         "followers": {$max:"$followers"},
         "friends":  {$max: "$friends"},
         "favorites": {$max: "$favorites"},
        "joining_year": {$first: "$joining_year"}
     }},
     {$out: "users"}
 ]
 
 db.vaccine_tweets.aggregate(pipeline).forEach(printjson)
 
 //extract retweet user information
 
 var pipeline=[
     {$match: {"retweeted_status.user.screen_name": {$ne:null}}},
     // {$match: {"user.location": {$ne:null}}},
      {$addFields: {
          year: {$year: {$toDate: "$retweeted_status.user.created_at"}}}},
      {$project:{
          "_id":0,
          "user": "$retweeted_status.user.screen_name",
          "location": "$retweeted_status.user.location",
          "followers": "$retweeted_status.user.followers_count",
          "friends": "$retweeted_status.user.friends_count",
          "favorites": "$retweeted_status.user.favourites_count",
         "joining_year": "$year"
       }},
       {$group: {
         _id:"$user",
         "location": {$first:"$location"},
         "followers": {$first:"$followers"},
         "friends":  {$first: "$friends"},
         "favorites": {$first: "$favorites"},
        "joining_year": {$first: "$joining_year"}
     }},
     //{$limit: 10}
      {$out: "retweeted_users"}
  ]
  
  db.vaccine_tweets.aggregate(pipeline).forEach(printjson)
 
  //union users and retweet user to create user node
 
  var pipeline=[
      {$unionWith: {coll: "retweeted_users"}},
      {$group: {
          _id:"$_id",
          "location": {$first:"$location"},
          "followers": {$first:"$followers"},
          "friends":  {$first: "$friends"},
          "favorites": {$first: "$favorites"},
         "joining_year": {$first: "$joining_year"}
      }},
      {$addFields:
         {
           location: { $replaceAll: { input: "$location", find: ",", replacement: "|" } }
      }},
      {$addFields:
         {
           location: { $replaceAll: { input: "$location", find:  ".", replacement: "" } }
      }},
      { $addFields: 
      //retrieve the location that starts with a character and ends with a character. Remove invalid location.
         { returnLocation: { $regexFind: { input: "$location", regex: /^[A-Z].*[A-Z]$/i} } 
      }},
      {$addFields:
         {
           label: "User"
      }},
      {$project:{
         "01_user": "$_id",
         "02_followers": "$followers",
         "03_friends": "$friends",
         "04_favorites":"$favorites",
         "05_joining_year": "$joining_year",
         "06_location": "$returnLocation.match",
         "07_label": "$label"
      }},
   // {$limit:10}
    {$out:"user_node"}
  ]
 
  db.users.aggregate(pipeline).forEach(printjson)
 
  //extract number of retweets for each user. Created retweet edge
 
 var pipeline=[
     //only look at the retweet
     {$match: {"retweeted_status.user.screen_name": {$ne:null}}},
     //remove self retweet
     {$addFields:{"flag":{
         $strcasecmp:["$user.screen_name", "$retweeted_status.user.screen_name"]}}},
     {$match: {"flag": {$ne:0}}},
     {$group: {
         _id: {"retweeted_user": "$retweeted_status.user.screen_name", "user": "$user.screen_name", },
         "numRetweets": {$sum:1}
     }},
     //{$sort: {"numRetweets":-1}},
     {$addFields:
         {
           type: "IS_RETWEETED_BY"
      }},
     {$project:{
        "01_retweeted_user": "$_id.retweeted_user", 
        "02_user": "$_id.user",
        "03_numRetweets": "$numRetweets",
        "04_type": "$type",
         "_id": 0
      }},
      //{$limit:10}
     {$out: "retweet_edge"}
 ]
 
 db.vaccine_tweets.aggregate(pipeline).forEach(printjson)
 
 //extract tweets node
var pipeline=[
    {$addFields: {
        date: {$toDate: "$created_at"}}},
    {$addFields: {
        source: { $regexFind: { input: "$source", regex: />.*</i}}}},
    {$addFields:
    {
       source: { $replaceAll: { input: "$source.match", find: ">", replacement: ""}}}},
    {$addFields:
      {
           source: { $replaceAll: { input: "$source", find: "<", replacement: ""}}}},
    {$addFields:
       {
              label: "Tweet"
       }},
    {$group: {
        "_id":"$id_str",
        "02_created_at": {$first:"$date"},
         "03_source": {$first:"$source"},
         "04_language":{$first:"$lang"},
        "05_latitude": {$first:{$arrayElemAt: ["$geo.coordinates", 0]}},
        "06_longitude": {$first: {$arrayElemAt: ["$geo.coordinates", 1]}},
        "07_label": {$first:"$label"}
    }},
  //{$limit:10}
 {$out: "tweets"}
]

//for big dataset, need to set allowDiskUse to true
db.vaccine_tweets.aggregate(pipeline, {allowDiskUse: true }).forEach(printjson)


//extract tweeted edge
var pipeline=[
     {$addFields:
       {
              type: "TWEETED"
       }},
    {$group: {
        "_id": "$id_str",
        "02_user_name":{$first:"$user.screen_name"},
        "03_type": {$first:"$type"}
    }},
 // {$limit:10}
 {$out: "tweeted"}
]

//for big dataset, need to set allowDiskUse to true
db.vaccine_tweets.aggregate(pipeline, {allowDiskUse: true }).forEach(printjson)


//This is to verify some tweets have dupliated tweet id
var pipeline=[
   {$group: {
       "_id":"$id_str",
       "count": {$sum: 1},
   }},
   {$sort: {count:-1}}, 
  {$limit:10}
]

db.vaccine_tweets.aggregate(pipeline).forEach(printjson)