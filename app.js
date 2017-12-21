var express = require("express");
var app = express();
var faker = require("faker");

app.set("view engine","ejs");

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    var campgronds = [];
    for (var i = 0; i < 10; i++) {
        var cg = {
            name: faker.name.firstName(),
            image: faker.image.imageUrl() 
        };
        campgronds.push(cg);
    }
    
    res.render("campgrounds",{ campgronds: campgronds });
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server has started") ;
});

