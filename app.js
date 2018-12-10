var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var passportLocal = require("passport-local");
var passportMongoose = require("passport-local-mongoose");
var app = express();

//var commentRoutes = require("./routes/comments");

// MODELS
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");

// SEEDING
var seedDB = require("./seeds.js")
seedDB();

// SET UP MONGOOSE, BODY-PARSER, EJS
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});
mongoose.set("useFindAndModify", false);
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(require("express-session")({
  secret: "Holo",
  resave: false,
  saveUninitialized: false
}));

// PASSPORT CONFIG
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// MIDDLEWARE
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});

// CAMPGROUND ROUTES

app.get("/", function(req, res){
  res.render("landing");
});

app.get("/campgrounds", function(req, res){
  req.user;
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

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
  Campground.findById(req.params.id, function(error, campground){
    if(error){
      console.log(error);
    } else {
      res.render("comments/new", {campground: campground});
    }
  });
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
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

// AUTH ROUTES

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  User.register(new User({username: req.body.username}), req.body.password, function(error, user){
    if(error){
      console.log(error);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/campgrounds");
      });
    }
  });
});

app.get("/login", function(req, res){
  res.render("login");
});

app.post("/login", passport.authenticate("local",
 {
   successRedirect: "/campgrounds", failureRedicrect: "/login"

 }), function(req, res){});

app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect("/login");
};

app.listen(3000, function(){
  console.log("The YelpCamp Server Has Started!");
});
