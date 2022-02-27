const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');
const {Test,testSchema} = require("../Models/test")


const teacherSchema = new mongoose.Schema ({
  tName: String,
  class: String,
  password: String
});

teacherSchema.plugin(passportLocalMongoose, {usernameUnique: false,usernameField : 'username' });
teacherSchema.plugin(findOrCreate);

const Teacher = new mongoose.model("Teacher", teacherSchema);

module.exports=Teacher;
