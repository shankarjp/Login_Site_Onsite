const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

var captcha = "";

app.get("/", (req, res) => {
    captcha = "";
    var characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%*";
    var length = 6;
    for(var i=0; i<length; i++) {
        var index = Math.floor(Math.random() * characters.length);
        captcha = captcha + characters[index];
    }
    res.render("login", {captcha: captcha});
});

app.post("/", (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var response = req.body.response;
    var count = 0;
    if((username.toString().length !== 9) || (parseInt(username.toString().slice(6,9)) > 200)) {
        console.log("Invalid Username");
        count += 1;
    };
    var upper=0;
    var lower=0;
    var num=0;
    var special=0;
    password = password.toString();
    for(var i=0; i<password.length; i++) {
        if(/[A-Z]/.test(password[i])) {
            upper += 1;
        } else if(/[a-z]/.test(password[i])) {
            lower += 1;
        } else if(Number.isInteger(parseInt(password[i]))) {
            num += 1;
        } else {
            special += 1;
        }
    };
    if((upper==0) || (lower==0) || (num==0) || (special==0)) {
        console.log("Invalid Password");
        count += 1;
    };
    if(response !== captcha) {
        console.log("Incorrect Response");
        count += 1;
    };
    if(count === 0) {
        res.send("Successfully Logged In!");
    } else {
        res.redirect("/");
    };
});

app.listen(3000, (req, res) => {
    console.log('Server running on port 3000');
});
