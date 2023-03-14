const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authenticate = require("./authenticate");
const User = require("./user");
const app = express();
const userRouter = express.Router(); 

app.use(bodyParser.json());

userRouter.route('/signUp')
.post((req,res,next)=>{
    User.register(new User({username: req.body.username}), req.body.password, (err, user)=>{
        if(err){
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({err : err});
        }
        else{
            if(req.body.firstname)
                user.firstname = req.body.firstname;
            if(req.body.lastname)
                user.lastname = req.body.lastname;
            user.save((err,user)=>{
                if(err){
                    res.statusCode = 500;
                    res.setHeader("Content-Type", "application/json");
                    res.json({err : err});
                }
                else{
                    passport.authenticate("local")(req,res,()=>{
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.json({success: true, Status: "Registration Successful"});
                });
            }
            });
        }
    })
});
    
userRouter.route("/login")
.post(passport.authenticate("local"),(req,res)=>{
        var token = authenticate.getToken({_id: req.user._id});
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({success: true, Token: token, Status: "You successfully logged into the system.."});
});
    
userRouter.route("/logout")
.get((req,res,next)=>{
    if(req.session){
        req.session.destroy();
        res.clearCookie("usersession");
        res.json({Status: "Logged out of the system.."});
    }
    else{
        var err = new Error("You are not logged in..");
        err.statusCode = 403;
        next(err);
        }
    })
    
userRouter.route("/signOut")
.delete((req,res,next)=>{
    User.findOneAndRemove({_id: req.user._id})
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({Status: "User with userId "+req.user._id+" deleted successfully from database.."});
    }, (err)=>next(err))
    .catch((err)=> next(err));
});
   
module.exports = userRouter;