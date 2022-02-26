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

mongoose
  .connect(conn_uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => {
    console.log("Connected to DB");
    app.listen(3000);
  })
  .catch((err) => console.log(err));

mongoose.set("useCreateIndex", true);

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(expressfu({ limits: { fileSize: 10 * 1024 * 1024 },abortOnLimit : true }));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);


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

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});