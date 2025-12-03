// Import express and ejs
var express = require ('express')
var ejs = require('ejs')
const path = require('path')
var mysql = require('mysql2')
require("dotenv").config();
var session = require("express-session")
var expressSanitizer = require('express-sanitizer');

// Create the express application object
const app = express()
const port = 8000

// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs')

// Set up the body parser 
app.use(express.urlencoded({ extended: true }))

// Create an input sanitizer
app.use(expressSanitizer());

// Set up public folder (for css and static js)
app.use(express.static(path.join(__dirname, 'public')))


//Creating a session
app.use(session({
    secret: "somerandomstuff",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}))

// Define our application-specific data
app.locals.shopData = {shopName: "Bertie's Books"}

//Defines the database connection pool
const db = mysql.createPool({
    host: 'localhost',
    user: process.env.BB_USER, 
    password: process.env.BB_PASSWORD,
    database: process.env.BB_DATABASE,
    charset: 'utf8mb4',
    ssl: false,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
global.db = db;

// Load the route handlers
const mainRoutes = require("./routes/main")
app.use('/', mainRoutes)

// Load the route handlers for /users
const usersRoutes = require('./routes/users')
app.use('/users', usersRoutes)

// Load the route handlers for /books
const booksRoutes = require('./routes/books')
app.use('/books', booksRoutes)

// Load the route handlers for /weather
const weatherRoutes = require('./routes/weather')
app.use('/weather', weatherRoutes)

/*
// Define the database connection pool
const db = mysql.createPool({
    host: 'localhost',
    user: 'berties_books_app',
    password: 'qwertyuiop',
    database: 'berties_books',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
global.db = db;
*/

// Start the web app listening
app.listen(port, () => console.log(`Example app listening on port ${port}!`))