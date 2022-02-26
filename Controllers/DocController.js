const Student = require("../Models/users");
const multer = require("multer")


const doc_submit=(req,res)=>{
  // const submittedKey = req.body.sKey;
  //
  // Student.findById(req.user.id, function(err, foundUser){
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     if (foundUser) {
  //       foundUser.sKey = submittedKey;
  //       foundUser.save(function(){
  //       res.redirect("/exam");
  //       });
  //     }
  //   }
  // });

  console.log(req.file)
}

const doc_register=(req,res)=>{
  Student.register({username: req.body.username}, req.body.password, function(err, user){
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/exam");
      });
    }
  });
}

const doc_login=(req,res)=>{
  const st = new Student({
    username: req.body.username,
    password: req.body.password
  });

  req.login(st, function(err){
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/exam");
      });
    }
  });
}

const isUserLoggedIn=(req, res, next)=> {
  if (req.isAuthenticated()){
    uploadStorage.single("strex")
    next();
    } else {
    res.redirect("/login");
    }

}

module.exports = {
  doc_submit,
  doc_register,
  doc_login,
  isUserLoggedIn
}
