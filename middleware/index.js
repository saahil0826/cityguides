var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
  //are they logged in?
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, function(err, foundCampground) {
      if (err) {
        req.flash("error", "Campground not found");
        res.redirect("back");
      } else {
        //do they own the campground?
        if (foundCampground.author.id.equals(req.user._id)) {
          next(); // this is the part which changes as per the route to edit, delete
        } else {
          req.flash("error", "You don't have the permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to edit this");
    res.redirect("back");
  }
}


middlewareObj.checkCommentOwnership = function(req, res, next) {
    //are they logged in?
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err) {
        req.flash("error", "Comment not found");
        res.redirect("back");
      } else {
        //do they own the comment?
        if (foundComment.author.id.equals(req.user._id)) {
          next(); // this is the part which changes as per the route to edit, delete
        } else {
          req.flash("error", "You don't have the permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to edit this comment");
    res.redirect("/login");
  }
}


//user should see the comment section only if they are logged in
middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to be logged in to do that");
  res.redirect("/login");
}



module.exports = middlewareObj
