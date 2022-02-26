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

const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

app.get('/uploadFile', (req, res) => {
  res.render('uploadFile', { title: 'Test Window' });
});


app.listen(3000, function() {
  console.log("Server started on port 3000.");
});

