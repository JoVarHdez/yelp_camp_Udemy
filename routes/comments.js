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
          req.flash("error", "Something went wrong");
          console.log(error);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          campground.comments.push(comment);
          campground.save();
          req.flash("success", "Successfully added comment!");
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

router.get("/:idComment/edit", middleware.isLoggedIn,  middleware.checkCommentOwnership, function(req, res){
   res.render("comments/edit", {campground_id: req.params.id, comment: req.comment});
});

router.put("/:idComment", middleware.isAdmin,  middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.idComment, req.body.comment, function(error, updatedComment){
    if(error){
      res.redirect("edit");
    } else {
      res.redirect("/campgrounds/" + req.params.id)
    }
  });
});

router.delete("/:idComment", middleware.isLoggedIn,  middleware.checkCommentOwnership, function(req, res){
  Campground.findByIdAndUpdate(req.params.id, {
    $pull: {comments: req.params.idComment}
  }, function(error){
    if(error){
      req.flash("error", error.message);
      res.redirect("/");
    } else {
      Comment.findByIdAndRemove(req.params.idComment, function(error){
        if(error){
          req.flash("error", error.message);
          return res.redirect("/");
        }
        req.flash("success", "Comment deleted!");
        res.redirect("/campgrounds/" + req.params.id);
      });
    }
  });
});

module.exports = router;
