const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const dishRouter = express.Router(); 

app.use(bodyParser.json());

dishRouter.route('/')
.all((req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next)=>{
    res.send("Providing all the dishes mentioned by you..");
})
.post((req,res,next)=>{
    res.send("Will provide dishes like "+ req.body.dishname+ " and details like "+ req.body.detail);
})
.put((req,res,next)=>{
    res.statusCode = 403;
    res.send("PUT request is not supported for selecting dishes..");
})
.delete((req,res,next)=>{
    res.send("Deleting all the dishes mentioned..");
})

dishRouter.route('/:dishId')
.get((req,res,next)=>{
    res.send("Will provide dish of dish id: "+ req.params.dishId);
})
.post((req,res,next)=>{
    res.statusCode = 403;
    res.send("POST request is not supported for updating dishes..");
})
.put((req,res,next)=>{
    res.send("Will update dishes "+ req.body.dishname+ " and details like "+ req.body.detail + " of specified dish id: "+req.params.dishId);
})
.delete((req,res,next)=>{
    res.send("Deleting  dish of dish id: "+ req.params.dishId);
})

module.exports = dishRouter;