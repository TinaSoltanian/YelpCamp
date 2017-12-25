var express     = require("express"),
    app         = express(),
    faker       = require("faker"),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    SeedDB      = require("./seeds");

SeedDB();

mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));

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
         res.render("index",{ campgronds: allCampgrounds });      
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
   res.render("new.ejs") ;
});

app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, findCampground){
       if(err) {
           console.log(err);
       }
       else{
          res.render("show",{campground: findCampground});    
       }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server has started") ;
});

