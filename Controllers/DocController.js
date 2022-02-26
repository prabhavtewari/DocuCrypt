require('dotenv').config();

const Student = require("../Models/users");
const multer = require("multer")
const passportLocalMongoose = require("passport-local-mongoose");
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const passport = require("passport");
const session = require('express-session');
const cloudinary = require('cloudinary');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {


        cb(null, "uploads")
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now()+".pdf")
    }
})

const uploadStorage = multer({ storage: storage })

cloudinary.config({
  cloud_name: 'somethingtemporary',
  api_key: process.env.C_API_KEY,
  api_secret: process.env.C_SECRET
});


const doc_submit=async(req,res)=>{

  const submittedKey = req.body.sKey;

  await Student.findById(req.user.id, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        cloudinary.v2.uploader.upload("C:/Users/HP/Documents/NodeProjects/DocuCrypt/uploads/"+req.file.filename,
        { public_id: foundUser.id },
        function(error, result) {console.log(result,error); });
        foundUser.sKey = submittedKey;
        foundUser.save(function(){
        // res.redirect("/exam");
        });
      }
    }
  });

  console.log(req.file)
}

const doc_register=(req,res)=>{
  Student.register({username: req.body.username}, req.body.password, function(err, user){
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/uploadFile");
      });
    }
  });
}

const doc_login=(req,res)=>{

  const student = new Student({
    username: req.body.email,
    password: req.body.password
  });

  req.login(student, function(err){
    if (err) {
      console.log(err);
    } else {
      console.log("elsepart");

      passport.authenticate("local")(req, res, function(){
        res.redirect("/uploadFile");
      });
    }
  });
}

const isUserLoggedIn=async(req, res, next)=> {
  if (req.isAuthenticated()){
    next();
    } else {
    res.redirect("/login");
    }

}

module.exports = {
  doc_submit,
  doc_register,
  doc_login,
  isUserLoggedIn,
  uploadStorage
}
