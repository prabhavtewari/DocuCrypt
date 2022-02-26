onst mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');

const testSchema = new mongoose.Schema ({
  class: String,
  s_time: new Date("<YYYY-mm-ddTHH:MM:ss>"),
  e_time: new Date("<YYYY-mm-ddTHH:MM:ss>"),
  password: String,
  pdfName: String,
  sKey: String,
  mentorId: String,
  mentorName: String,
  q1:String,
  e_time: String,
});

testSchema.plugin(passportLocalMongoose);
testSchema.plugin(findOrCreate);

const Test = new mongoose.model("Test", studentsSchema);

module.exports=Test;
