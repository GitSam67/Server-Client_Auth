const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const morgan = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const passport = require("passport");
const authenticate = require("./authenticate");
const config = require("./config");

const index = require("./index");
const userRouter = require("./userRouter");
const dishRouter = require("./dishRouter");

const hostname = "localhost";
const port = process.env.PORT || 3000;

const app = express();

const server = http.createServer(app);

const url = config.mongoUrl;
const connect = mongoose.connect(url);

connect.then((db)=>{
    console.log("Connected to server successfully..");
},(err)=>console.log(err));

app.use(morgan('dev'));
app.use(bodyParser.json());

app.use(session({
    secret: config.secretKey,
    name : "usersession",
    saveUninitialized: false,
    resave: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/users", userRouter);
app.use("/", index);
app.use("/dishes", dishRouter);


server.listen(port, hostname, ()=>{
    console.log(`Server running on http://${hostname}:${port}`);
});