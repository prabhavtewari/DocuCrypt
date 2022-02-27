require("dotenv").config();

const Student = require("../Models/users");
const Answer = require("../Models/answer");
const { Test, testSchema } = require("../Models/test");
const Teacher = require("../Models/teacher");
const multer = require("multer");
const passportLocalMongoose = require("passport-local-mongoose");
const mongoose = require("mongoose");
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require("mongoose-findorcreate");
const passport = require("passport");
const session = require("express-session");
const cloudinary = require("cloudinary");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".pdf");
  },
});

const uploadStorage = multer({ storage: storage });

cloudinary.config({
  cloud_name: "somethingtemporary",
  api_key: process.env.C_API_KEY,
  api_secret: process.env.C_SECRET,
});

const doc_submit = async (req, res) => {
  // const submittedKey = req.body.sKey;
  await Student.findById(req.user.id, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (req.file) {
          cloudinary.v2.uploader.upload("C:/Users/HP/Documents/NodeProjects/DocuCrypt/uploads/"+req.file.filename,
          // cloudinary.v2.uploader.upload(
          //   "C:/Users/prabh/Desktop/code/DocuCrypt/uploads/" +
          //     req.file.filename,
            { public_id: foundUser.id },
            function (error, result) {
              if (result) {
                const newAns = new Answer({
                  class: req.body.class,
                  test_name: req.body.testName,
                  testId: req.body.testId,
                  SHA_key: req.body.SHA_key,
                  file_link: result.url,
                  st_id: foundUser.id,
                  st_uname: req.user.username,
                  comment: req.body.comment,
                });
                newAns.save();
                console.log("Answer Submitted: " + result.url);
              } else {
                console.log(err);
              }
            }
          );

          foundUser.save(function () {
            res.render("./submitConfirm",{title:"Submission",status:1});
          });
        }
        else{
                const newAns = new Answer({
                  class: req.body.class,
                  test_name: req.body.testName,
                  testId: req.body.testId,
                  SHA_key: req.body.SHA_key,
                  st_id: foundUser.id,
                  st_uname: req.user.username,
                  comment: req.body.comment,
                });
                newAns.save()
                .then((result)=>{
                  console.log("Submitted Key");
                  res.render("./submitConfirm",{title:"Submission",status:2});
                  // res.redirect(foundUser.id+"/UploadLater");
                })
                .catch((err)=>{
                  console.log(err);
                  res.redirect("/");
                });

        }
      }
    }
  });

  // console.log(req.file)
};

const doc_uploadAgain =async(req,res)=>{
  await cloudinary.v2.uploader.upload("C:/Users/HP/Documents/NodeProjects/DocuCrypt/uploads/"+req.file.filename,
  // cloudinary.v2.uploader.upload(
  //   "C:/Users/prabh/Desktop/code/DocuCrypt/uploads/" +
  //     req.file.filename,
    { public_id: req.body.answerId },
    function (error, result){
      if(result){
        Answer.findById(req.body.answerId,async(err,user)=>{
          // user.update({"file_link": {"$exists": false}}, {"$set": {"file_link": req.body.id}});
          // user.file_link=result.url;
          user.file_link = result.url;
          await user.save();
          res.render("./submitConfirm",{title:"Submission",status:1});
        })
      }else{
        console.log(error);
      }
    })
}

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
          res.redirect("/studentDashboard");
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
    qs: req.body.question,
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
        console.log("Test and Teacher added");

        res.redirect("/");
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
      res.redirect("/login");
    } else {
      console.log("else part");
      Student.findOne({ username: student.username}, (err, st)=> {
        if(st){
          res.cookie('student_id',st._id,{
            httpOnly:true
          });

        }else{
          console.log(err);
        }
      });

      passport.authenticate("st-local")(req, res, function () {
        res.redirect("/studentDashboard");
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
  doc_uploadAgain
};
