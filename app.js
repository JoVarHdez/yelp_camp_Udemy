var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var cookieParser = require("cookie-parser");
var passport = require("passport");
var passportLocal = require("passport-local");
var methodOverride = require("method-override");
var app = express();

require('dotenv').load();

// ROUTES
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

// MODELS
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");

// SEEDING
var seedDB = require("./seeds.js")
// seedDB();

// SET UP MONGOOSE, BODY-PARSER, EJS, SEESION
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});
mongoose.set("useFindAndModify", false);
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(cookieParser('secret'));
app.locals.moment = require('moment');
app.locals.moment().format();

app.use(flash());

// PASSPORT CONFIG
app.use(require("express-session")({
  secret: "Holo",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// MIDDLEWARE & MESSAGES
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// USE ROUTES
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// LISTENER
app.listen(3000, function(){
  console.log("The YelpCamp Server Has Started!");
});
