var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

router.get("/", function(req, res){
  req.user;
  Campground.find({}, function(error, allCampgrounds){
    if(error){
      console.log(error);
    } else {
      res.render("campgrounds/index",{campgrounds: allCampgrounds});
    }
  });
})

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
  Campground.create({name: name, image:image, description:description, author: author}, function(error, newCampground){
    if(error){
      console.log(error);
    } else {
      res.redirect("campgrounds");
    }
  });
});

router.get("/:id", function(req, res){
  Campground.findById(req.params.id).populate("comments").exec(function(error, foundCampground){
    if(error){
      console.log(error);
    } else {
      res.render("campgrounds/show", {campground: foundCampground});
    }
  });
});

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(error, foundCampground){
      res.render("campgrounds/edit", {campground: foundCampground});
    });
});

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(error, updatedCamp){
    if(error){
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
  Campground.findOneAndRemove(req.params.id, function(error){
    if(error){
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;
