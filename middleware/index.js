var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please log in first")
    res.redirect("/login")
}

middlewareObj.CheckCampgroundOwnership = function CheckCampgroundOwnership(req, res, next) {
    
    if (req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground) {
            if(err){
                res.redirect("back");
            } else {
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }
                else{
                  res.send("You are not allowed to do that!");   
                }
            }
        })
    }
    else{
        res.send("You should logged in to to that!");
    }
}

middlewareObj.CheckCommentOwnership = function CheckCommentOwnership(req, res, next) {
    
    if (req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err){
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }
                else{
                  res.send("You are not allowed to do that!");   
                }
            }
        })
    }
    else{
        res.send("You should logged in to to that!");
    }
}


module.exports = middlewareObj;
