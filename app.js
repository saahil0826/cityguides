require("dotenv").config();

var express = require("express"),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require("mongoose"),
  flash = require("connect-flash"),
  passport = require("passport"),

  localStrategy = require('passport-local'),
  Campground = require("./models/campground"),
  Comment = require("./models/comment"),
  User = require("./models/user"),
  seedDB = require("./seed"),
  methodOverride = require("method-override");

  PORT = process.env.PORT || 4002;

var commentRoutes = require('./routes/comments'),
    indexRoutes = require('./routes/index'),
    campRoutes = require('./routes/campgrounds');

// seedDB();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(methodOverride('_method'));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(flash());

mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true
});
  app.locals.moment = require('moment'),

//passport configuration
app.use(require("express-session")({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});



app.use("/", indexRoutes);
app.use("/campgrounds", campRoutes);
app.use("/campgrounds/:id/comments", commentRoutes); //for this to work express royter of this file has to be altered



app.get('*', function(req, res) {
  res.send("Not found!")
});



app.listen(PORT, function() {
  console.log(`now listening on port ${PORT}`);
});
