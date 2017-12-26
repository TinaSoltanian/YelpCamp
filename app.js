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
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

// var campgroundSchema = new mongoose.Schema({
//     name: String,
//     image: String,
//     description: String
// });

// var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
//     name: "Granite Hill",
//     image: "http://cdn.onlyinyourstate.com/wp-content/uploads/2017/04/granitehille1-700x604.jpg",
//     description: "This is huge granite hill! No restrooms! Beautiful GRANITE!!!"
// },function(err, campground){
//   if(err) {
//       console.log(err);
//   }else{
//       console.log("New insrted campground: ");
//       console.log(campground);
//   }
// });

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
   
   Campground.find({}, function(err, allCampgrounds){
       if (err){
           console.log(err);
       }else{
         res.render("campgrounds/index",{ campgronds: allCampgrounds });      
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
app.get("/campgrounds/:id/comments/new", function(req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if(err){
            console.log(err);
        }
        else{
          res.render("comments/new", {campground: campground});       
        }
    })
});

app.post("/campgrounds/:id/comments", function (req, res) {
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

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server has started") ;
});

