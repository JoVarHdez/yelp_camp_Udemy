var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership= function (req, res, next) {
  if(req.isAuthenticated()){
    Campground.findById(req.params.id, function(error, foundCampground){
      if(error || !foundCampground){
        req.flash("error", "Campground not found");
        res.redirect("back");
      } else {
        if(foundCampground.author.id.equals(req.user.id)){
          next();
        } else {
          req.flash("error", "You don't have permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be loggin to do that");
    res.redirect("back");
  }
};

middlewareObj.checkCommentOwnership= function (req, res, next) {
  if(req.isAuthenticated()){
    Comment.findById(req.params.idComment, function(error, foundComment){
      if(error || !foundComment){
        req.flash("error", "Comment not found");
        res.redirect("back");
      } else {
        if(foundComment.author.id.equals(req.user.id)){
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be loggin to do that");
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = function (req, res, next) {
    if(req.isAuthenticated()){
      return next();
    }
    req.flash("error", "You need to be loggin to do that");
    res.redirect("/login");
};

middlewareObj.isAdmin = function(req, res, next){
  if(req.user.isAdmin){
    next();
  } else {
    req.flash("error", "This site is now read only thanks to spam and trolls.")
    res.redirect("back");
  }
};

module.exports = middlewareObj;
