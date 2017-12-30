var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
var geocoder = require('geocoder');
var multer  = require("multer");
var storage = multer.diskStorage({
    filename: function(req, file, callback){
        callback(null, file.originalname);
    }
});

var imageFilter = function(req, file, cb){
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)){
        return cb(new Error("only image files are allowed!"), false);
    }
    cb(null, true)
}
var upload = multer({storage: storage, fileFilter: imageFilter});

var cloudinary = require("cloudinary");
cloudinary.config({
    cloud_name: "dqfckag9c",
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

//index show all campgrounds
router.get("/", function(req, res){
   if(req.query.search){
         var regex = new RegExp(escapeRegExp(req.query.search), "gi");
         Campground.find({ 
             "$or" : [ {name: regex},
                        {description: regex}
                 ]
         }, function(err, allCampgrounds){
               if (err){
                   console.log(err);
               }else{
                 res.render("campgrounds/index",{ campgronds: allCampgrounds, page: "campgrounds" });      
               }
           })       
   } else {
       Campground.find({}, function(err, allCampgrounds){
           if (err){
               console.log(err);
           }else{
             res.render("campgrounds/index",{ campgronds: allCampgrounds, page: "campgrounds" });      
           }
       })
   }
});

//create campground
router.post("/", middleware.isLoggedIn, upload.single("image"), function(req, res){
       
    cloudinary.uploader.upload(req.file.path, function(result){

        req.body.campground.image = result.secure_url;
        req.body.campground.author = {
            id: req.user._id,
            username: req.user.username
        }
    
        geocoder.geocode(req.body.campground.location, function (err, data) {
            
            if (err || data.status === 'ZERO_RESULTS'  || data.results == []) {
              req.flash('error', err.message);
              return res.redirect('back');
            }
        
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
          
        req.body.campground.location = location;
        req.body.campground.lat = lat;
        req.body.campground.lng = lng;

          Campground.create(req.body.campground, function(err, campground){
              if(err){
                  req.flash("error", err.message)
                  return res.redirect("back");
              } else{
                res.redirect("/campgrounds");      
              }
            })
        });        
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
             res.render("campgrounds/edit", {campground: foundCampground});
        }
    })
});

//update logic for edited campground
router.put("/:id", upload.single("image"), function(req, res){
    
 cloudinary.uploader.upload(req.file.path, function(result){

        req.body.campground.image = result.secure_url;
        req.body.campground.author = {
            id: req.user._id,
            username: req.user.username
        }
          
      geocoder.geocode(req.body.campground.location, function (err, data) {
    
        if (err || data.status === 'ZERO_RESULTS' || data.results == []) {
          req.flash('error', err.message);
          return res.redirect('back');
        }
        console.log(data);
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        
        req.body.campground.location = location;
        req.body.campground.lat = lat;
        req.body.campground.lng = lng;        
        
        // var newData = {name: req.body.campground.name, 
        //               image: req.body.campground.image, 
        //               description: req.body.campground.description, 
        //               price: req.body.campground.price, 
        //               location: location, 
        //               lat: lat, 
        //               lng: lng};
        Campground.findByIdAndUpdate(req.params.id, {$set: req.body.campground}, function(err, campground){
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

function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

module.exports = router;