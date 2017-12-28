var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
var geocoder = require('geocoder');

//index show all campgrounds
router.get("/", function(req, res){
   
   Campground.find({}, function(err, allCampgrounds){
       if (err){
           console.log(err);
       }else{
         res.render("campgrounds/index",{ campgronds: allCampgrounds, page: "campgrounds" });      
       }
   })
});

//create campground
router.post("/", middleware.isLoggedIn, function(req, res){
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var description = req.body.description;
  var author={
      id: req.user._id,
      username: req.user.username
  }
  
geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
      
      var newCampGround = {
          name: name,
          price, price,
          image: image,
          description: description,
          author: author,
          location: location, 
          lat: lat, 
          lng: lng
      };
      
      Campground.create(newCampGround, function(err, campgound){
          if(err){
              console.log(err);
          } else{
            res.redirect("/campgrounds");      
          }
        })
    });
});

//new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new") ;
});

//show
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, findCampground){
      if(err || !findCampground) {
          req.flash("error","Campground not found");
          return res.redirect("/campgrounds");
      }
      else{
          res.render("campgrounds/show",{campground: findCampground});    
      }
    });
});

//edit campground
router.get("/:id/edit", middleware.CheckCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err || !foundCampground){
            req.flash("error", "Campground not found")
            res.redirect("/campgrounds")
        } else {
             res.render("campgrounds/edit", {campgound: foundCampground});
        }
    })
});

//update logic for edited campground
router.put("/:id", function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = {name: req.body.name, image: req.body.image, description: req.body.description, cost: req.body.cost, location: location, lat: lat, lng: lng};
    Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
  });
});

//delete campground
router.delete("/:id", middleware.CheckCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if (err){
            res.redirect("/campgrounds")
        } else {
            res.redirect("/campgrounds")
        }
    })
})

module.exports = router;