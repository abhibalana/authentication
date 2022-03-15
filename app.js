require('dotenv').config();
const express =  require("express");
const bosyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();
app.use(bosyparser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');
mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const secret = process.env.SECRET;
userSchema.plugin(encrypt,{secret:secret,encryptedFields:['password']});

const User = mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    const user = User({
        username : req.body.username,
        password : req.body.password
    });
    user.save(function(err){
        if(!err){
            res.render("secrets");
        }
        else{
            console.log(err);
        }
    });

});

app.post("/login",function(req,res){
    User.findOne({username : req.body.username},function(err,result){
        if(result){
            if(result.password === req.body.password){
                res.render("secrets");
            }
            else{
                res.send("wrong password");
            }
        }
    });
});




app.listen(3000,function(err){
    if(!err){
        console.log("server start listening");
    }
})
