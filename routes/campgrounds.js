var express = require('express');
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index");

// router.get('/', function(req, res) {
//   // res.render('campgrounds', {campgrounds: campgrounds}); this gets campgrounds from an array
//   if (req.query.search) {
//   const regex = new RegExp(escapeRegex(req.query.search), 'gi');
//   //campground from db
//   Campground.find({name: regex}, function(err, allCampgrounds) {
//     if (err) {
//       console.log(err);
//     } else {
//       res.render('campgrounds/index', {campgrounds: allCampgrounds, page: 'campgrounds'});
//     }
//   });
//   }
// });

router.get("/", function(req, res){
    var noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all campgrounds from DB
        Campground.find({name: regex}, function(err, allCampgrounds){
           if(err){
               console.log(err);
           } else {
              if(allCampgrounds.length < 1) {
                  noMatch = "No campgrounds match that query, please try again.";
              }
              res.render("campgrounds/index",{campgrounds:allCampgrounds, noMatch: noMatch});
           }
        });
    } else {
        // Get all campgrounds from DB
        Campground.find({}, function(err, allCampgrounds){
           if(err){
               console.log(err);
           } else {
              res.render("campgrounds/index",{campgrounds:allCampgrounds, noMatch: noMatch});
           }
        });
    }
});

router.post('/', middleware.isLoggedIn, function(req, res) {
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newCampground = {
    name: name,
    price: price,
    image: image,
    description: description,
    author: author
  }
  Campground.create(newCampground, function(err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
        req.flash("success", "Campground added");
      res.redirect('/campgrounds');
    }
  });
});

//show form to create new campground
// this has to be declared first and then the /campgrounds/new
router.get('/new', middleware.isLoggedIn, function(req, res) {
  res.render('campgrounds/new');
});

router.get('/:id', function(req, res) {
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/show", {
        campground: foundCampground
      });
    }
  });
});
//edit


//edit routes
  router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res) {
      Campground.findById(req.params.id, function(err, foundCampground) {
        res.render("campgrounds/edit", {campground: foundCampground});
      });
    });

//update route
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds/"+req.params.id);
    }
  });
});

//delete

router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res) {
  //destroy campground
  Campground.findByIdAndRemove(req.params.id, function(err, updated) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      req.flash("success", "Campground removed ");
      res.redirect("/campgrounds");
    }
  });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports = router;
