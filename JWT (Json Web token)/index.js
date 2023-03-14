const express = require("express");
const bodyParser = require("body-parser");
const authenticate = require("./authenticate");
const index = express.Router();

index.use(bodyParser.json());

index.route("/")
.get(authenticate.verifyUser, (req,res)=>{
    res.send("Express Server Homepage..");
})

module.exports = index;

