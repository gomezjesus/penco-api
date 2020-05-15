const config = require("config");
const Joi = require("joi");
const startUpDebugger = require("debug")("app:startup");
const dbDebugger = require("debug")("app:db");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const courses = require("./routes/courses");
const home = require("./routes/home");
const app = express();
app.set("view engine", "pug");

//path of all views
app.set("views", "./views"); //default
const logger = require("./middleware/logger");
const auth = require("./middleware/auth");

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // x-form-encoded
app.use(express.static("public")); // use to serve static file i.e localhost:5000/readme.txt; since you declared 'public' it will start searching from that path, no need to include public word on url
app.use(helmet());

//Routes
app.use("/", home);
app.use("/api/courses", courses);
app.use(logger);
app.use(auth);

//Configuration
console.log("Application Name:" + config.get("name"));
console.log("Mail Server:" + config.get("mail.host"));
console.log("Mail Password:" + config.get("mail.password"));

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  startUpDebugger("Morgan enabled...");
}

//db work
//$Env:DEBUG = "app:startup,app:db" this for windows powershell
//export DEBUG=app:startup,app:db" this for MAc
dbDebugger("Connected to database...");

const port = process.env.PORT || 5000;
app.listen(process.env.PORT || 5000, () =>
  console.log(`Listening on port ${port}...`)
);
