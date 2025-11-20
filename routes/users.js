// Create a new router
const express = require("express")
const router = express.Router()

const bcrypt = require("bcrypt")
const saltRounds = 10

router.get('/register', function (req, res, next){
    res.render('register.ejs')
})

router.post('/registered', function (req, res, next){
    const plainPassword = req.body.password
    
    //Hash the password before storing it in the database
    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        if(err){
            next(err)
            return
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
                let resultMsg = 'Hello '+ req.body.first + ' '+ req.body.last +' you are now registered!'  
                'We will send an email to you at ' + req.body.email
                resultMsg += ' Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword
                res.send(resultMsg)
            }
        });
    });
});

router.get("/list", function(req, res, next){
    let sqlquery = "SELECT id, username, first_name, last_name, email, created_at FROM users";

    db.query(sqlquery, (err, result) => {
        if(err){
            next(err)
        } else{
            res.render("listusers.ejs", {users: result})
        }
    })
});

router.get("/login", function (req, res, next){
    res.render("login.ejs")
});

router.post("/loggedin", function (req, res, next){
    const username = req.body.username;
    const password = req.body.password;
    
    //Select the user from the database
    let sqlquery = "SELECT * FROM users WHERE username = ?";
    db.query(sqlquery, [username], (err, result) => {
        if(err){
            next(err);
            return;
        }
        
        //Check if user exists
        if(result.length == 0){
            res.send("Login failed: Username not found");
            return;
        }
        
        const user = result[0];
        const hashedPassword = user.hashedPassword;
        
        //Compare the password supplied with the password in the database
        bcrypt.compare(password, hashedPassword, function(err, result){
            if(err){
                logLoginAttempt(username, false, req); // ADD THIS
                next(err);
            }else if(result == true){
                logLoginAttempt(username, true, req); // ADD THIS
                res.send("Login successful! Welcome back " + user.first_name + " " + user.last_name);
            }else{
                logLoginAttempt(username, false, req); // ADD THIS
                res.send("Login failed: Incorrect password");
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

router.get("/audit", function(req, res, next){
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
