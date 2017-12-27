var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

router.get("/", function(req, res){
   
   Campground.find({}, function(err, allCampgrounds){
       if (err){
           console.log(err);
       }else{
         res.render("campgrounds/index",{ campgronds: allCampgrounds, currentUser: req.user });      
       }
   })
});

router.post("/", function(req, res){
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

router.get("/new",function(req, res){
   res.render("campgrounds/new") ;
});

router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, findCampground){
       if(err) {
           console.log(err);
       }
       else{
          res.render("campgrounds/show",{campground: findCampground});    
       }
    });
});

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    
    res.redirect("/login")
}

module.exports = router;