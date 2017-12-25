var mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"); 
    
var data = [
        { 
            name: "Mountain", 
            image: "https://farm3.staticflickr.com/2919/14554501150_8538af1b56.jpg",
            description: "Maecenas pulvinar ornare sagittis. Donec gravida leo gravida malesuada fringilla. Donec eu ultrices ex. Quisque augue orci, semper vel erat non, molestie tempus enim. Donec nisi arcu, porta quis enim faucibus, convallis varius sem. Integer interdum risus a augue tincidunt, vitae bibendum mauris ullamcorper. Donec metus nunc, dignissim id metus ac, mattis porta est. Suspendisse elementum mi ex, sit amet tristique velit tempor nec. Nulla facilisi. In in risus vitae augue consequat luctus vestibulum et nisl."
        }, 
        {
            name: "Mountain2",
            image: "https://farm5.staticflickr.com/4153/4835814837_feef6f969b.jpg",
            description: "Maecenas pulvinar ornare sagittis. Donec gravida leo gravida malesuada fringilla. Donec eu ultrices ex. Quisque augue orci, semper vel erat non, molestie tempus enim. Donec nisi arcu, porta quis enim faucibus, convallis varius sem. Integer interdum risus a augue tincidunt, vitae bibendum mauris ullamcorper. Donec metus nunc, dignissim id metus ac, mattis porta est. Suspendisse elementum mi ex, sit amet tristique velit tempor nec. Nulla facilisi. In in risus vitae augue consequat luctus vestibulum et nisl."
        },
        {
            name: "Lake",
            image: "https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg",
            description: "Maecenas pulvinar ornare sagittis. Donec gravida leo gravida malesuada fringilla. Donec eu ultrices ex. Quisque augue orci, semper vel erat non, molestie tempus enim. Donec nisi arcu, porta quis enim faucibus, convallis varius sem. Integer interdum risus a augue tincidunt, vitae bibendum mauris ullamcorper. Donec metus nunc, dignissim id metus ac, mattis porta est. Suspendisse elementum mi ex, sit amet tristique velit tempor nec. Nulla facilisi. In in risus vitae augue consequat luctus vestibulum et nisl. "
        }
    ];

function seedDB() {
    Comment.remove({}, function(err) {
        if(err){
            console.log(err)
        }
        else{
    //remove all campgrounds
        Campground.remove({}, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("campground has been removed!");
                //add new campgrounds
            data.forEach(function(seed) {
                Campground.create(seed, function(err, campground) {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("added a campground");
                        //create comment
                        Comment.create(
                            {
                                text: "This place is great, but I wish there was internet",
                                author: "Homer"
                            }, function(err, comment) {
                                if(err) {
                                    console.log(err);
                                } else {
                                    console.log("created new comment");
                                    campground.comments.push(comment);
                                    campground.save();
                                }
                            })
                    }
                })
            });
        }
        });            
      }
    })
    
}

module.exports = seedDB;