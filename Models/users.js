const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');


const studentsSchema = new mongoose.Schema ({
  email: String,
  password: String,
  pdf: String,
  sKey: String,
  mentorId: String,
  mentorName: String
});

studentsSchema.plugin(passportLocalMongoose);
studentsSchema.plugin(findOrCreate);

const Student = new mongoose.model("Student", studentsSchema);

module.exports=Student;
