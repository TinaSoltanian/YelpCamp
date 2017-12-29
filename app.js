var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    // Campground  = require("./models/campground"),
    // Comment     = require("./models/comment"),
    SeedDB      = require("./seeds"),
    passport    = require("passport"),
    localStrategy= require("passport-local"),
    user         = require("./models/user"),
    methodOverride = require("method-override"),
    flash          =require("connect-flash");
    
var commentsRoute = require("./routes/comments"),
    campgrondsRoute = require("./routes/campgrounds"),
    indexRoute = require("./routes/index");
 
//SeedDB();


var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp" 
mongoose.connect( url, {useMongoClient: true});
mongoose.Promise = global.Promise;
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.locals.moment = require('moment');

//passport configuration
app.use(require("express-session")({
   secret: "this is secret!",
   resave: false,
   saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error"); 
    res.locals.success = req.flash("success"); 
    next();
})

app.get("/", function(req, res){
    res.render("landing");
});

app.use("/", indexRoute);
app.use("/campgrounds", campgrondsRoute);
app.use("/campgrounds/:id/comments", commentsRoute);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server has started") ;
});

