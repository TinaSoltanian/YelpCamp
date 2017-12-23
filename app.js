var express     = require("express"),
    app         = express(),
    faker       = require("faker"),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
//     name: "Granite Hill",
//     image: "http://cdn.onlyinyourstate.com/wp-content/uploads/2017/04/granitehille1-700x604.jpg"
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
         res.render("campgrounds",{ campgronds: allCampgrounds });      
       }
   })
});

app.post("/campgrounds", function(req, res){
  var name = req.body.name;
  var image = req.body.image;
  
  var newCampGround = {
      name: name,
      image: image
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

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server has started") ;
});

