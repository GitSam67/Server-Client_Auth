const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const morgan = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");
const FileStore = require("session-file-store")(session);

const dishRouter = require("./dishRouter");

const hostname = "localhost";
const port = process.env.PORT || 3000;

const app = express();

const server = http.createServer(app);

const url = "mongodb://localhost:27017/restapi";
const connect = mongoose.connect(url);

connect.then((db)=>{
    console.log("Connected to server successfully..");
    },(err)=>console.log(err));

    app.use(session({
        name: "session",
        secret: "677667-766776",
        saveUninitialized: false,
        resave: false,
        store: new FileStore()
    }));

    function auth(req,res,next){

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
            if(username == "admin" && password == "password"){
                req.session.user = "admin";
                next(); // Authorized..
            }
            else{
                var err = new Error("You are not authenticated to access the server..");
                res.setHeader("WWW-Authenticate", "Basic");
                err.statusCode = 401;
                return next(err);
            }
        }
        else{
            if(req.session.user == "admin"){
                console.log(req.session);
                next(); // Server assigns cookie to user
            }
            else{
                var err = new Error("You are not authenticated to access the server..");
                res.setHeader("WWW-Authenticate", "Basic");
                err.statusCode = 401;
                return next(err);
            }
        }

        
    }

// By using Express Router..

app.use(auth);
app.use(morgan('dev'));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use("/dishes", dishRouter);
app.use("/dishes/:dishId", dishRouter);

server.listen(port, hostname, ()=>{
    console.log(`Server running on http://${hostname}:${port}`);
});