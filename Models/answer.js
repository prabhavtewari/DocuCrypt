const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');

const answerSchema = new mongoose.Schema ({
  class: String,
  test_name: String,
  SHA_key : String,
  file_link: String,
  s_id: String,
  st_id: String
},
 { timestamps: true }
);
answerSchema.plugin(passportLocalMongoose);
answerSchema.plugin(findOrCreate);

const Answer = new mongoose.model("Answer", answerSchema);

module.exports=Answer;
