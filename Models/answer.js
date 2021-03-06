const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');

const answerSchema = new mongoose.Schema ({
  class: String,
  test_name: String,
  testId: String,
  SHA_key : String,
  file_link: String,
  s_id: String,
  st_id: String,
  st_uname: String,
  comment: String
},
 { timestamps: true }
);
answerSchema.plugin(passportLocalMongoose, {usernameUnique: false,usernameField : 'test_name' });
answerSchema.plugin(findOrCreate);

const Answer = new mongoose.model("Answer", answerSchema);

module.exports=Answer;
