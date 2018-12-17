var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

router.get("/", function(req, res){
  var noMatch = null;
  if(req.query.search ) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Campground.find({name: regex}, function(error, allCampgrounds){
      if(error){
        console.log(error);
      } else {
        if(allCampgrounds.length < 1) {
                  noMatch = "No campgrounds match that query, please try again.";
        }
        res.render("campgrounds/index",{campgrounds:allCampgrounds, noMatch: noMatch});
      }
    });
  } else {
    Campground.find({}, function(error, allCampgrounds){
      if(error){
        console.log(error);
      } else {
          res.render("campgrounds/index",{campgrounds: allCampgrounds, page: "campgrounds"});
      }
    });
  }
});

router.get("/new", middleware.isLoggedIn, function(req, res){
  res.render("campgrounds/new");
});

router.post("/", middleware.isLoggedIn, function(req, res){
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var price = req.body.price;
  var newCampground = {name: name, image: image, description: description, price: price, author:author};
  Campground.create(newCampground, function(error, newCampground){
    if(error){
      console.log(error);
    } else {
      req.flash("success", "Successfully added Campground!");
      res.redirect("campgrounds");
    }
  });
});

router.get("/:id", function(req, res){
  Campground.findById(req.params.id).populate("comments").exec(function(error, foundCampground){
    if(error || !foundCampground){
      req.flash("error", "Campground not found!");
      res.redirect("back");
    } else {
      res.render("campgrounds/show", {campground: foundCampground});
    }
  });
});

router.get("/:id/edit", middleware.isLoggedIn,  middleware.checkCampgroundOwnership, function(req, res){
  Campground.findById(req.params.id, function(error, foundCampground){
    if(error){
      console.log(error);
    } else {
      res.render("campgrounds/edit", {campground: foundCampground});
    }
  });
});

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
  var newData = {name: req.body.name, image: req.body.image, description: req.body.description, price: req.body.price};
  Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(error, campground){
      if(error){
          req.flash("error", error.message);
          res.redirect("back");
      } else {
          req.flash("success","Successfully Updated!");
          res.redirect("/campgrounds/" + campground._id);
      }
  });
});

router.delete("/:id", function(req, res) {
  Campground.findByIdAndRemove(req.params.id, function(err, campground) {
    Comment.deleteOne({
      _id: {
        $in: campground.comments
      }
    }, function(err, comments) {
      req.flash('error', campground.name + ' deleted!');
      res.redirect('/campgrounds');
    })
  });
});

module.exports = router;
