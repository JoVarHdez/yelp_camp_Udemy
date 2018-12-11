var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function(req, res){
  Campground.findById(req.params.id, function(error, campground){
    if(error){
      console.log(error);
    } else {
      res.render("comments/new", {campground: campground});
    }
  });
});

router.post("/", middleware.isLoggedIn, function(req, res){
  Campground.findById(req.params.id, function(error, campground){
    if(error){
      console.log(error);
      res.redirect("/campgrounds")
    } else {
      Comment.create(req.body.comment, function(error, comment){
        if(error){
          console.log(error);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

router.get("/:idComment/edit", middleware.checkCommentOwnership, function(req, res){
  Comment.findById(req.params.idComment, function(error, foundComment){
    if(error){
      res.redirect("back");
    } else {
      res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
    }
  });
});

router.put("/:idComment", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.idComment, req.body.comment, function(error, updatedComment){
    if(error){
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id)
    }
  });
});

router.delete("/:idComment", middleware.checkCommentOwnership, function(req, res){
  Comment.findOneAndRemove(req.params.idComment, function(error){
    if(error){
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

module.exports = router;
