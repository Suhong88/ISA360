//Chpater 4. Querying Document

//find a document with a condition
//1. find all comments made by Cameron Duran. Display name and date.



// exclude _id in the result




//save results into a variable and use next() to display next one




// finding the distinct fields
//2. How many rated category in movies collection?




//3. find all rated category that were released in 1994





// counting the documents. It will not physically count the documents. Instead, it will read through the collection's
// metadata and return the count

//4. Count number of the movies



// count all movies are released in 1994




// do an exact count



//conditional operators: $eq, $ne, $gt, $gte
//5. Find the numbe of the movies that have less than 5 comments.




//6.  find all movies released in the 21st century (since January 1,2000). Display title and released year.




//in $in and not in $nin
// 7. find all movies with a rated category of G, PG or PG-13.




//8. Find all unrated movies in 2008.





// logical operators $and, $or, $nor, $not
//9. find all movies where Leonardo DiCaprio is a cast member, Martin Scorsese is a director, is in either Drama or Crime genres.
// display title, year, cast, directors and genres.



//Regular Expressions. It is case sensitive
//10. Find all movies where title includes Opera




//using the caret(^) operator



//using the dollar($) operator




//11. find all movies where title starts with two numbers



//12. find all movies starting with number and include word Street




//query arrays and nested documents
//finding an array by an element
//13. find all movies where Charles Chaplin and Edna Purviance are cast members.





//Projecting Array Elements using $
// 14. find all movies where genre is Drama.




//display the first matching element.



//Projecting matching elements by their index position ($slice)
//15. display movie titled Youth without youth




//return the first three elements




//return the last two elements only




//starting at second element and pick 2




//Query nested objects
// sorting documents. 1: ascending, -1: descending
// 16. Find movies that have won at least 10 awards and received 6 nominations. Display awards and title. Only show top 5.




//17. Display all movies where Charles Chaplin is a cast memeber. Display title, awards win and genres. 
//sort by the first element in genre and then awards win.





//Activity 4.0.1
//finding movies by genre and paginating results
// Activity 4.01: Finding Movies by Genre and Paginate Results

var genre = "Action"
var pageSize = 5

function findMoviesByGenre(genre, pageSize){
    
    var movies = db.movies.find(
        {"genres" : genre},
        {"_id" : 0, "title" :1, "genres":1}).
        sort({"imdb.rating" : -1}).
        limit(pageSize).
        toArray()

    return movies
}

//call function

findMoviesByGenre("Drama", 5)

drama= findMoviesByGenre("Drama", 5)