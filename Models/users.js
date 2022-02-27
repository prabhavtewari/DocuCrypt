const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');
const {Test,testSchema} = require("../Models/test")


const studentsSchema = new mongoose.Schema ({
  email: String,
  password: String,
},
 { timestamps: true }
);

studentsSchema.plugin(passportLocalMongoose);
studentsSchema.plugin(findOrCreate);

const Student = new mongoose.model("Student", studentsSchema);

module.exports=Student;
