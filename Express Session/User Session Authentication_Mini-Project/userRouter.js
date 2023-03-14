const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./users");
const app = express();
const userRouter = express.Router(); 

app.use(bodyParser.json());

userRouter.route('/signUp')
.post((req,res,next)=>{
    console.log(req.body.username);
    User.findOne({username: req.body.username})
    .then((user)=>{
        if(user != null){
            var err = new Error("User " + req.body.username + "already exists..");
            err.statusCode = 403;
            next(err);
        }
        else{
            return User.create({
                username : req.body.username,
                password : req.body.password
            })
        }
    })
    .then((user)=>{
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({Status: "Registration Successful", user: req.body.username});
    }), (err)=>next(err)
    .catch((err)=> next(err));
});

userRouter.route("/login")
.post((req,res,next)=>{
    if(!req.session.user){
        console.log(req.headers);
        var authHeader = req.headers.authorization;
        console.log(authHeader);
        if(!authHeader){
            var err = new Error("You are not authenticated to access the server..");
            res.setHeader("WWW-Authenticate", "Basic");
            err.statusCode = 401;
            return next(err); // Not Authorized
        } 

        var authInfo = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
        console.log(authInfo);
        var username = authInfo[0];
        var password = authInfo[1];
        console.log(username + " : " + password);
        
        User.findOne({username: username})
        .then((user)=>{
            if(user == null){
                var err = new Error("User " + username + "doesn't exists..");
                err.statusCode = 403;
                next(err);
            }
            else if(user.password != password){
                var err = new Error("Entered password is incorrect..");
                err.statusCode = 403;
                next(err);
            }
            else if(user.username == username && user.password == password){
                req.session.user = "Authenticated"
                res.statusCode = 200;
                res.setHeader("Contetn-Type", "text/plain");
                res.send("Login successfull.."); // Authorized
            }
        }), (err)=>next(err)
        .catch((err)=> next(err));
        
        
    }
    else{
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        res.send("You are already Authenticated..");
    }

userRouter.route("/logout")
.get((req,res,next)=>{
    if(req.session){
        req.session.destroy();
        res.clearCookie("usersession");
        res.redirect("/");
    }
    else{
        var err = new Error("You are not logged in..");
        err.statusCode = 403;
        next(err);
        }
    })
});

    
module.exports = userRouter;