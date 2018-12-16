require("dotenv").config();

var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", function(req, res){
  res.render("landing");
});

router.get("/register", function(req, res){
  res.render("register", {page: "register"});
});

router.post("/register", function(req, res){
  var newUser = new User({username: req.body.username});
  if(req.body.adminCode === process.env.ADMIN_CODE) {
    newUser.isAdmin = true;
  }
  User.register(newUser, req.body.password, function(error, user){
    if(error){
      req.flash("error", error.message);
      res.redirect("/register");
    }
    passport.authenticate("local")(req, res, function(){
      req.flash("success", "Welcome to YelpCamp " + user.username);
      res.redirect("/campgrounds");
    });
  });
});

router.get("/login", function(req, res){
  res.render("login", {page: "login"});
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/campgrounds');
    });
  })(req, res, next);
});

router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "See you later!");
  res.redirect("/campgrounds");
});

module.exports = router;
