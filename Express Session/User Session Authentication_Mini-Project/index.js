const express = require("express");
const bodyParser = require("body-parser");
const index = express.Router();

index.use(bodyParser.json());

index.route("/")
.get((req,res)=>{
    res.send("Express Server Homepage..");
})

module.exports = index;

