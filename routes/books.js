// Create a new router
const express = require("express")
const router = express.Router()

router.get('/search',function(req, res, next){
    res.render("search.ejs")
});

router.get('/search_result', function (req, res, next) {
    //Sets the keyword
    let keyword = req.query.keyword;

    //More accuracy
    if(!keyword || keyword.trim() == "") {
        return res.render("search_result.ejs", {booksFound: [], keyword: ""});
    }

    //Checks throught the database matching keywords
    let sqlquery = "SELECT * FROM books WHERE name LIKE ?";
    //
    let searchValue = "%" + keyword + "%";
    //searching in the database
    db.query(sqlquery, [searchValue], (err, result) =>{
        if(err){
            next(err);
        }
        else{
            res.render("search-result.ejs", {booksFound: result, keyword: keyword} )
        }
    });
});

router.get('/list', function(req, res, next) {
    let sqlquery = "SELECT * FROM books"; //Query database to get all the books
    //Execute sql query
    db.query(sqlquery, (err, result) => {
        if (err){
            next(err)
        }
        res.render("list.ejs", {availableBooks:result})
    });
});

router.get('/addbook',function(req, res, next){
    res.render('addbook.ejs')
});

router.post('/bookadded', function (req, res, next) {
    // saving data in database
    let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)"
    // execute sql query
    let newrecord = [req.body.name, req.body.price]
    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            next(err)
        }
        else
            res.send(' This book is added to database, name: '+ req.body.name + ' price £'+ req.body.price)
    })
});

router.get("/bargainbooks", function (req, res, next) {
    //Query to get books with price less than 20
    let sqlquery = "SELECT * FROM books WHERE price < 20";
    //Execute SQL query
    db.query(sqlquery, (err, result) => {
        if (err){
            next(err);
        }
        else{
            res.render("bargainbooks.ejs", { bargainBooks: result });
        }
    });
});

// Export the router object so index.js can access it
module.exports = router
