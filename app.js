require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const expressfu = require("express-fileupload");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");
const authRoute = require("./Routes/auth");

const conn_uri = process.env.MONGO_URI;

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(conn_uri, { useNewUrlParser: true })
  .then((res) => {
    console.log("Connected to DB");
    app.listen(3000);
  })
  .catch((err) => console.log(err));

mongoose.set("useCreateIndex", true);

const Student = require("./Models/users")

app.use(express.static("public"));
app.use(express.json());
app.use(expressfu({ limits: { fileSize: 10 * 1024 * 1024 },abortOnLimit : true }));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
passport.use(Student.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  Student.findById(id, function(err, user) {
    done(err, user);
  });
});


app.use("/api/auth", authRoute);

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.get("/uploadFile", (req, res) => {
  res.render("uploadFile", { title: "Test Window" });
});
app.post("/auth/submit", (req, res) => {
  console.log(req.body);
  console.log(req.files);
  res.send("Hi");
});

app.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});
app.get('/register', (req, res) => {
  res.render('register', { title: 'Sign Up' });
});

app.get("/register", function (req, res) {
  res.render("register");
});