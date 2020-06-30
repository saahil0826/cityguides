var express = require('express');
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);



router.get('/', function(req, res) {
  res.redirect('/campgrounds');
});



//show register form

router.get("/register", function(req, res){
   res.render("register", {page: 'register'});
});

router.post('/register', function(req, res) {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(error, user) {
    if (error) {
      return res.render("register", {"error": error.message});
    }
    passport.authenticate("local")(req, res, function() {
        req.flash("success", "Welcome to YelpCamp " + req.body.username);
      res.redirect("/campgrounds");
    });

  })
});


//login routes

//render login form
//middleware
router.get("/login", function(req, res){
   res.render("login", {page: 'login'});
});
//handling login logic



router.post('/login', passport.authenticate("local", {
  successRedirect: "/campgrounds", successFlash: 'Welcome!',
  failureRedirect: "/login", failureFlash: 'Invalid username or password.'
}), function(req, res) {});

router.get('/logout', function(req, res) {
  req.logout();
  req.flash("success", "Logged you out");
  res.redirect("/campgrounds")
});

//
// router.get('/checkout', async (req, res) => {
//   try {
//     let amount = 1099;
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: 1099,
//       currency: 'inr',
//       // Verify your integration in this guide by including this parameter
//       metadata: {integration_check: 'accept_a_payment'},
//     });
//     const { client_secret } = paymentIntent; //object destructuring
//     res.render('checkout', { client_secret, amount });
//   } catch (err) {
//     req.flash("success", err.message);
//     res.redirect('back')
//   }
//
// });

module.exports = router;
