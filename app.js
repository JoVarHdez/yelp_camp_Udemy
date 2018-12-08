var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var campgrounds = [
  {name: "Volcán Arenal", image: "https://cdn.getyourguide.com/img/tour_img-1281708-146.jpg"},
  {name: "Volcán Irazú", image: "https://www.govisitcostarica.co.cr/images/photos/full-irazu-volcano-crater.jpg"},
  {name: "Volcán Poás", image: "https://www.govisitcostarica.co.cr/images/photos/full-poas-volcano-crater(1).jpg"}
];
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", function(req, res){
  res.render("landing");
});

app.get("/campgrounds", function(req, res){
  res.render("campgrounds",{campgrounds: campgrounds});
})

app.get("/campgrounds/new", function(req, res){
  res.render("new");
});

app.post("/campgrounds", function(req, res){
  var name = req.body.name;
  var image = req.body.image;
  var newCampgroud = {name: name, image:image};
  campgrounds.push(newCampgroud);
  res.redirect("campgrounds");
});

app.listen(3000, function(){
  console.log("The YelpCamp Server Has Started!");
});
