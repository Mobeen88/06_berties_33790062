// Create a new router
const express = require("express")
const router = express.Router()

const bcrypt = require("bcrypt")
const saltRounds = 10

const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
         req.session.redirectTo = req.originalUrl
         res.redirect('./login') // redirect to the login page
    }else{ 
        next (); // move to the next middleware function
    } 
};

const { check, validationResult } = require('express-validator');

router.get('/register', function (req, res, next){
    res.render('register', {
        errors: [],
        old: { first: '', last: '', email: '', username: '' }
    });
});

router.post('/registered', 
    [check('email').isEmail().withMessage("Enter a valid email"), 
    check('username').isLength({ min: 5, max: 20}).withMessage("Username must be 5-20 characters"),
    check('password').isLength({ min:8}).withMessage("Password must be at least 8 characters"),
    check('first').notEmpty().withMessage('First name required'),
    check('last').notEmpty().withMessage('Last name required')], 
    function (req, res, next){

    req.body.first = req.sanitize(req.body.first);
    req.body.last = req.sanitize(req.body.last);
    req.body.email = req.sanitize(req.body.email);
    req.body.username = req.sanitize(req.body.username);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('register', {
            errors: errors.array(),
            old: {
            first: req.body.first,
            last: req.body.last,
            email: req.body.email,
            username: req.body.username}
            });
        }  
        
        const plainPassword = req.body.password
        
        //First check if username already exists
        let checkSql = "SELECT * FROM users WHERE username = ?";
        db.query(checkSql, [req.body.username], (err, result) => {
        if (err) return next(err);

        if (result.length > 0) {
            return res.send("Registration failed: username already exists.");
        }

            //Hash the password before storing it in the database
            bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
                if(err){
                    return next(err);
                }
                
                //Store hashed password in your database
                let sqlquery = "INSERT INTO users (username, first_name, last_name, email, hashedPassword) VALUES (?,?,?,?,?)"
                let newrecord = [
                    req.body.username, 
                    req.body.first, 
                    req.body.last, 
                    req.body.email, 
                    hashedPassword
                ]
                
                //Use db.query just like in book.js
                db.query(sqlquery, newrecord, (err, result) => {
                    if(err){
                        next(err)
                    }else{
                        let resultMsg = 
                        'Hello ' + req.body.first + ' ' + req.body.last + ', you are now registered! ' +
                        'We will send an email to ' + req.body.email + '. ' +
                        'Your password is: ' + req.body.password + ' and your hashed password is: ' + hashedPassword;
                        res.send(resultMsg)
                    }
            });
        });
    });
});

router.get("/list", redirectLogin, function(req, res, next){
    let sqlquery = "SELECT id, username, first_name, last_name, email, created_at FROM users";

    db.query(sqlquery, (err, result) => {
        if(err){
            next(err)
        }else{
            res.render("listusers.ejs", {users: result})
        }
    })
});

router.get("/login", function (req, res, next){
    res.render("login.ejs")
});

router.post("/loggedin", function (req, res, next){
    const username = req.body.username
    const password = req.body.password

    //Select the user from the database
    let sqlquery = "SELECT * FROM users WHERE username = ?"
    db.query(sqlquery, [username], (err, result) => {
        if (err) return next(err)

        //Check if user exists
        if (result.length == 0) {
            logLoginAttempt(username, false, req)
            return res.send("Login failed: Username not found")
        }

        const user = result[0]
        //const hashedPassword = user.hashedPassword;

        //Compare the password supplied with the password in the database
        bcrypt.compare(password, user.hashedPassword, function (err, match) {
            if(err){
                logLoginAttempt(username, false, req)
                return next(err)
            }
            if(match){
                //Save user session here, when login is successful
                req.session.userId = username
                logLoginAttempt(username, true, req)
                const redirectTo = req.session.redirectTo || '/users/list'
                delete req.session.redirectTo
                return res.redirect(redirectTo)
            }else{
                logLoginAttempt(username, false, req)
                return res.send("Login failed: Incorrect password")
            }
        });
    });
});

function logLoginAttempt(username, success, req){
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get("User-Agent") || "Unknown";
    
    let sqlquery = "INSERT INTO audit_log (username, success, ip_address, user_agent) VALUES (?, ?, ?, ?)";
    let newrecord = [username, success, ipAddress, userAgent];
    
    db.query(sqlquery, newrecord, (err, result) => {
        if(err){
            console.error('Failed to log login attempt:', err);
        }
    });
};

router.get("/audit", redirectLogin, function(req, res, next){
    let sqlquery = "SELECT username, attempt_time, success, ip_address, user_agent FROM audit_log ORDER BY attempt_time DESC";
    
    db.query(sqlquery, (err, result) =>{
        if(err){
            next(err);
        }else{
            res.render("audit.ejs", {auditLogs: result});
        }
    });
});

// Export the router object so index.js can access it
module.exports = router
