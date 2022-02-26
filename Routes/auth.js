require('dotenv').config();

const reuter = require("express").Router()
const multer = require("multer")
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const DocController = require("../Controllers/DocController");
const Student = require("../Models/users")

var storage = multer.diskStorage({
    destination: function (req, file, cb) {


        cb(null, "uploads")
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now()+".pdf")
    }
})

const uploadStorage = multer({ storage: storage })


reuter.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

reuter.use(passport.initialize());
reuter.use(passport.session());




passport.use(Student.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  Student.findById(id, function(err, user) {
    done(err, user);
  });
});

reuter.post("/submit",uploadStorage.single("strex"),DocController.doc_submit);

reuter.post("/register", DocController.doc_register);

reuter.post("/login",DocController.doc_login);



module.exports = reuter;
