const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = process.env.PORT || 8000;

app.use(cookieParser());

const cookie = (req,res,next)=>{
    res.cookie("SamCookie", "Credentials", {
        httpOnly: true,
        maxAge: 700000
    });
    next();
}

app.get("/", (re,res)=>{
    res.send("Hello Cookies....!!");
});

app.use(cookie);

app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});
