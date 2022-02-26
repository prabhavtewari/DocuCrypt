require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const authRoute = require("./Routes/auth");

const conn_uri = process.env.MONGO_URI;

mongoose.connect(conn_uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => {
    console.log("Connected to DB");
    app.listen(3000);
  })
  .catch((err) => console.log(err));

mongoose.set("useCreateIndex", true);

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));


app.use("/api/auth", authRoute)

app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

app.get('/uploadFile', (req, res) => {
  res.render('uploadFile', { title: 'Test Window' });
});



app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

// cloudinary.config({
//   cloud_name: 'dpnkosbg4',
//   api_key: process.env.C_API_KEY,
//   api_secret: process.env.C_SECRET
// });

// cloudinary.v2.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" },
//   function(error, result) {console.log(result); });
