//jshint esversion:6

const bodyParser = require("body-parser");
const express  =  require("express");
const ejs =  require("ejs")
const path = require("path");
const mongoose =  require("mongoose");

// const path = require("path");


const app =  express();

app.use(express.static("public"));

app.use(express.static(path.join(__dirname, 'build')));


app.set('view engine' , "ejs");

app.use(bodyParser.urlencoded({
    extended: true
}));


// start mongodb server first 
//mongoose.connect("mongodb://localhost:27017/secretsDB1", {useNewUrlParser : true,  useUnifiedTopology: true});
mongoose.connect("mongodb+srv://gauravSewda:ZussjmD2NCPhx4em@cluster0.al82mcw.mongodb.net/?retryWrites=true&w=majority");
// now setting up new user database
const userSchema= {
    email: String,
    passWord : String
}

// initialize neww user 

const user  =  new mongoose.model("User" , userSchema);



app.get("/" , function(req,res){
    res.render("home");
})

app.get("/login", (req,res)=>{
    res.render("login");
})

app.get("/register", (req,res)=>{
    res.render("register");
})
// 
// 
// we need to catch input data from user when he tries to register

app.post("/register" , (req,res)=>{
     const newUser =  new user({
           email: req.body.username,
           passWord: req.body.password
     });

     newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
            console.log("done");
            res.redirect("/login");
        }
     });
});


app.post("/login" , function(req,res){
    const username =  req.body.username;
    const password =  req.body.password;
    // User.findOne({email: username} , function(err,foundUser){
    //     if(err){
    //         console.log(err);
    //     }else{
    //         if(foundUser){
    //             if(foundUser.passWord == password){
    //                 res.render("secrets");
    //             }
    //         }
    //     }

    // })
    res.redirect("/");
})



app.listen(4001, function(){
    console.log("server started on port 4001")
})