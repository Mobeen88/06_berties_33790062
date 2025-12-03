//Create new routers
const express = require("express");
const router = express.Router();
const request = require("request");

router.get('/books', function (req, res, next) {
    //Read query parameters
    let search = req.query.search;
    let minprice = req.query.minprice;
    let maxprice = req.query.maxprice;
    let sort = req.query.sort;

    // Query database to get all the books
    let sqlquery = "SELECT * FROM books";
    let conditions = [];
    let values = [];

    //Search term
    if (search){
        conditions.push("name LIKE ?");
        values.push("%" + search + "%");
    }

    //Price range
    if(minprice){
        conditions.push("price >= ?");
        values.push(minprice);
    }
    if(maxprice){
        conditions.push("price <= ?");
        values.push(maxprice);
    }

    if(conditions.length > 0){
        sqlquery += " WHERE " + conditions.join(" AND ");
    }

    //Sort
    if(sort == "name"){
        sqlquery += " ORDER BY name ASC";
    }else if (sort == "price"){
        sqlquery += " ORDER BY price ASC";
    }

    // Execute the sql query
    db.query(sqlquery, values, (err, result) => {
        // Return results as a JSON object
        if (err) {
            res.json(err)
            return next(err)
        }
        else {
            res.json(result)
        }
    });
});


// Export the router object so index.js can access it
module.exports = router