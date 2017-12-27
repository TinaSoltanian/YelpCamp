var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

router.get("/new", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if(err){
            console.log(err);
        }
        else{
          res.render("comments/new", {campground: campground});       
        }
    })
});

router.post("/",isLoggedIn, function (req, res) {
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
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
})

//edit comment route
router.get("/:comment_id/edit", CheckCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, comment) {
        if(err){
            res.redirect("back")
        } else {
           res.render("comments/edit", {campground_id: req.params.id, comment: comment})      
        }
    })
})

//update edited comment
router.put("/:comment_id", CheckCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back")
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

//delete comment
router.delete("/:comment_id", CheckCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back")
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    
    res.redirect("/login")
}

function CheckCommentOwnership(req, res, next) {
    
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


module.exports = router;
