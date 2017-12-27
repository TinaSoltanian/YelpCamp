var express     = require("express"),
    app         = express(),
    faker       = require("faker"),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    SeedDB      = require("./seeds"),
    passport    = require("passport"),
    localStrategy= require("passport-local"),
    user         = require("./models/user");
 
SeedDB();

mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});
mongoose.Promise = global.Promise;
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

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
    next();
})

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
   
   Campground.find({}, function(err, allCampgrounds){
       if (err){
           console.log(err);
       }else{
         res.render("campgrounds/index",{ campgronds: allCampgrounds, currentUser: req.user });      
       }
   })
});

app.post("/campgrounds", function(req, res){
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  
  var newCampGround = {
      name: name,
      image: image,
      description: description
  };
  
  Campground.create(newCampGround, function(err, campgound){
      if(err){
          console.log(err);
      } else{
        res.redirect("/campgrounds");      
      }
  })
});

app.get("/campgrounds/new",function(req, res){
   res.render("campgrounds/new") ;
});

app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, findCampground){
       if(err) {
           console.log(err);
       }
       else{
          res.render("campgrounds/show",{campground: findCampground});    
       }
    });
});

//===================
// comments routs
//===================
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if(err){
            console.log(err);
        }
        else{
          res.render("comments/new", {campground: campground});       
        }
    })
});

app.post("/campgrounds/:id/comments",isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }
                else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
})

//=============
// AUTH ROUTE
//=============
app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function(req, res) {
    console.log(req.body.username);
    console.log(req.body.password);
    var newUser = new user({username: req.body.username}); 
    user.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        })
    });
});

app.get("/login",function(req, res) {
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"}), function(req, res){
});

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
})

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    
    res.redirect("/login")
}


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server has started") ;
});

