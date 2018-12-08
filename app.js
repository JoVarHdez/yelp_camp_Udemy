var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var app = express();
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});

// Schema SetUp
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String
});
var Campground = mongoose.model("Campground", campgroundSchema);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", function(req, res){
  res.render("landing");
});

app.get("/campgrounds", function(req, res){
  Campground.find({}, function(error, allCampgrounds){
    if(error){
      console.log(error);
    } else {
      res.render("campgrounds",{campgrounds: allCampgrounds});
    }
  });
})

app.get("/campgrounds/new", function(req, res){
  res.render("new");
});

app.post("/campgrounds", function(req, res){
  var name = req.body.name;
  var image = req.body.image;
  Campground.create({name: name, image:image}, function(error, newCampground){
    if(error){
      console.log(error);
    } else {
      res.redirect("campgrounds");
    }
  });
});

app.listen(3000, function(){
  console.log("The YelpCamp Server Has Started!");
});
