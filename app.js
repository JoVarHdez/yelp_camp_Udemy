var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var app = express();

// MODELS
var Campground = require("./models/campground");
var Comment = require("./models/comment");
// var User = require("./models/user");

// SEEDING
var seedDB = require("./seeds.js")
seedDB();

// SET UP MONGOOSE, BODY-PARSER, EJS
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});
mongoose.set("useFindAndModify", false);
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

// CAMPGROUND ROUTES

app.get("/", function(req, res){
  res.render("landing");
});

app.get("/campgrounds", function(req, res){
  Campground.find({}, function(error, allCampgrounds){
    if(error){
      console.log(error);
    } else {
      res.render("campgrounds/index",{campgrounds: allCampgrounds});
    }
  });
})

app.get("/campgrounds/new", function(req, res){
  res.render("campgrounds/new");
});

app.post("/campgrounds", function(req, res){
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  Campground.create({name: name, image:image, description:description}, function(error, newCampground){
    if(error){
      console.log(error);
    } else {
      res.redirect("campgrounds");
    }
  });
});

app.get("/campgrounds/:id", function(req, res){
  Campground.findById(req.params.id).populate("comments").exec(function(error, foundCampground){
    if(error){
      console.log(error);
    } else {
      res.render("campgrounds/show", {campground: foundCampground});
    }
  });
});

// COMMENTS ROUTES

app.get("/campgrounds/:id/comments/new", function(req, res){
  Campground.findById(req.params.id, function(error, campground){
    if(error){
      console.log(error);
    } else {
      res.render("comments/new", {campground: campground});
    }
  });
});

app.post("/campgrounds/:id/comments", function(req, res){
  Campground.findById(req.params.id, function(error, campground){
    if(error){
      console.log(error);
      res.redirect("/campgrounds")
    } else {
      Comment.create(req.body.comment, function(error, comment){
        if(error){
          console.log(error);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

app.listen(3000, function(){
  console.log("The YelpCamp Server Has Started!");
});
