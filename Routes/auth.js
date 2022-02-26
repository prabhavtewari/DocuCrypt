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


reuter.post("/submit",[DocController.isUserLoggedIn,DocController.uploadStorage.single("strex")],DocController.doc_submit);

reuter.post("/register", DocController.doc_register);

reuter.post("/login", DocController.doc_login);



module.exports = reuter;
