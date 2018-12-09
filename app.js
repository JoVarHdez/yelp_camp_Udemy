var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var app = express();
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});


// https://cdn.getyourguide.com/img/tour_img-1281708-146.jpg Arenal
// https://www.govisitcostarica.co.cr/images/photos/full-irazu-volcano-crater.jpg irazu
// https://www.govisitcostarica.co.cr/images/photos/full-poas-volcano-crater(1).jpg poas
// Schema SetUp
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
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
      res.render("index",{campgrounds: allCampgrounds});
    }
  });
})

app.get("/campgrounds/new", function(req, res){
  res.render("new");
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
  Campground.findById(req.params.id, function(error, foundCampground){
    if(error){
      console.log(error);
    } else {
      res.render("show", {campground: foundCampground});
    }
  });
});

app.listen(3000, function(){
  console.log("The YelpCamp Server Has Started!");
});
