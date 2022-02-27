require("dotenv").config();

const Student = require("../Models/users");
const { Test, testSchema } = require("../Models/test");
const Teacher = require("../Models/teacher");
const multer = require("multer");
const passportLocalMongoose = require("passport-local-mongoose");
const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");
const passport = require("passport");
const cloudinary = require("cloudinary");
const bodyParser = require("body-parser");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".pdf");
  },
});

// const uploadStorage = multer({ storage: storage }).single('strex');
const uploadStorage = multer({ storage: storage });

cloudinary.config({
  cloud_name: "somethingtemporary",
  api_key: process.env.C_API_KEY,
  api_secret: process.env.C_SECRET,
});

const doc_submit = (req, res) => {
  // console.log(req.body);
  // if (req.file) {
  //   uploadStorage(req,res,function(err) {
  //     if(err) {
  //         return res.end("Error uploading file.");
  //     }
  //     res.end("File is uploaded");
  // console.log(req.body);

  // });
  // }
  // else{

  // }
  // res.redirect("/");
  console.log(req.files);

  const submittedKey = req.body.sKey;

   Student.findById(req.user.id, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {

        // cloudinary.v2.uploader.upload("C:/Users/HP/Documents/NodeProjects/DocuCrypt/uploads/"+req.file.filename,
        // { public_id: foundUser.id },
        // function(error, result) {console.log(result,error); });

        foundUser.save(function(){
        // res.redirect("/exam");
        });
      }
    }
  });

  console.log(req.file)
};

const doc_register = (req, res) => {
  Student.register(
    { username: req.body.username },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("st-local")(req, res, function () {
          res.redirect("/uploadFile");
        });
      }
    }
  );
};

const doc_teach_reg = (req, res) => {
  const newTest = new Test({
    class: req.body.class,
    s_time: req.body.stime,
    e_time: req.body.etime,
    test_name: req.body.tname,
    teacherMail: req.body.username,
    teacherName: req.body.name,
    submission_window: req.body.wtime,
  });

  const newTeacher = new Teacher({
    tName: req.body.name,
    class: req.body.class,
    username: req.body.username,
  });

  Teacher.register(newTeacher, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      res.redirect("/teachReg");
    } else {
      newTest.save();

      passport.authenticate("t-local")(req, res, function () {
        console.log("yooo");

        res.redirect("/uploadFile");
      });
    }
  });
};

const doc_login = (req, res) => {
  const student = new Student({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(student, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Student Signed In");
      passport.authenticate("st-local")(req, res, function () {
        res.redirect("/");
      });
    }
  });
};

const isUserLoggedIn = async (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
};

module.exports = {
  doc_submit,
  doc_register,
  doc_login,
  isUserLoggedIn,
  uploadStorage,
  doc_teach_reg,
};
