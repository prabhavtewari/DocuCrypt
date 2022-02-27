const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');

const testSchema = new mongoose.Schema ({
  class: String,
  s_time: Date,
  e_time: Date,
  test_name: String,
  teacherMail: String,
  teacherName: String,
  qs:String,
  submission_window : Number
},
 { timestamps: true }
);

testSchema.plugin(passportLocalMongoose, {usernameUnique: false,usernameField : 'test_name' });
testSchema.plugin(findOrCreate);

const Test = new mongoose.model("Test", testSchema);

module.exports={Test,testSchema};
