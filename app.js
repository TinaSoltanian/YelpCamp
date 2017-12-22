var express = require("express");
var app = express();
var faker = require("faker");
var bodyParser = require("body-parser");
app.set("view engine","ejs");

 var campgronds = [];

app.use(bodyParser.urlencoded({extended: true}));
app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
   
    campgronds = [];
    for (var i = 0; i < 10; i++) {
        var cg = {
            name: faker.name.firstName(),
            image: "https://img.buzzfeed.com/buzzfeed-static/static/2017-01/27/11/asset/buzzfeed-prod-fastlane-02/sub-buzz-16825-1485533127-1.jpg?downsize=715:*&output-format=auto&output-quality=auto"
            // image: faker.image.imageUrl() 
        };
        campgronds.push(cg);
    }
    
    res.render("campgrounds",{ campgronds: campgronds });
});

app.post("/campgrounds", function(req, res){
  var name = req.body.name;
  var image = req.body.image;
  
  var cg = {
      name: name,
      image: image
  };
  
  campgronds.push(cg);
  res.redirect("/campgrounds")
});

app.get("/campgrounds/new",function(req, res){
   res.render("new.ejs") ;
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server has started") ;
});

