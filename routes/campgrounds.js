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

router.post("/", isLoggedIn, function(req, res){
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var author={
      id: req.user._id,
      username: req.user.username
  }
  var newCampGround = {
      name: name,
      image: image,
      description: description,
      author: author
  };
  
  Campground.create(newCampGround, function(err, campgound){
      if(err){
          console.log(err);
      } else{
        res.redirect("/campgrounds");      
      }
  })
});

router.get("/new", isLoggedIn, function(req, res){
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

//edit campground
router.get("/:id/edit", function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err){
            res.redirect("/campgrounds")
        } else {
             res.render("campgrounds/edit", {campgound: foundCampground});
        }
    })
});

//update logic for edited campground
router.put("/:id", function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if (err){
            res.redirect("/campgrounds")
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

//delete campground
router.delete("/:id", function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if (err){
            res.redirect("/campgrounds")
        } else {
            res.redirect("/campgrounds")
        }
    })
})

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    
    res.redirect("/login")
}

module.exports = router;