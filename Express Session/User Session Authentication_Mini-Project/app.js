const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const morgan = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");
const FileStore = require("session-file-store")(session);

const index = require("./index");
const userRouter = require("./userRouter");

const hostname = "localhost";
const port = process.env.PORT || 3000;

const app = express();

const server = http.createServer(app);

const url = "mongodb://localhost:27017/auth";
const connect = mongoose.connect(url);

connect.then((db)=>{
    console.log("Connected to server successfully..");
},(err)=>console.log(err));

app.use(session({
    name: "usersession",
    secret: "677667-766776",
    saveUninitialized: false,
    resave: false,
    store: new FileStore()
}));

app.use("/users", userRouter);

    function auth(req,res,next){
        console.log(req.session);
        
        if(!req.session.user){
            var err = new Error("You are not Authenticated..");
            err.statsucode = 403;
            next(err);
        }
        else{
            if(req.session.user == "Authenticated"){
                next();
            }
            else{
                var err = new error("You are not Authenticated..");
                err.statsucode = 403;
                next(err);
            }
        }
}

app.use(auth);
app.use("/", index);
app.use(morgan('dev'));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

server.listen(port, hostname, ()=>{
    console.log(`Server running on http://${hostname}:${port}`);
});