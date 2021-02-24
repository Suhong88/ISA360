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




//The Group Stage
//2. Display number of titles/movies by rated category.




//3. Display top 5 rated category based on number of movies



//remove null




//dispaply total run time and average run time by rated


//format average run time as integer


//Exercise 7.03 Manipulating Data
/* 4. for only movies older than 2001, find the average and maximum popularity
(defined by the IMDB rating) for each genre, sort the genre by popularity, 
and find the adjusted (with trailers) runtime of the longest movie in each genre.
trailers run for 12 minutes before any film.
*/



/*5. find the best title from each genre for the movies older than 2001,
  run time is less than 200.
*/

 