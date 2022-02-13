const express = require('express');
//can have access to the id parameter defined out of this route
const router = express.Router({mergeParams:true});
const Recipe = require("../models/recipe");
const Review = require("../models/review"); 
const {reviewSchema} = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

const validateReview=(req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
      if(error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
      }else{
        next();
      }
  }
  

router.post('/',validateReview, catchAsync(async(req,res)=>{
    const recipe = await Recipe.findById(req.params.id);
    const review = new Review(req.body.review);
    recipe.reviews.push(review);
    await review.save();
    await recipe.save();
    req.flash('success',"Successfully created a new review!!")
    res.redirect(`/recipes/${recipe._id}`);
  }))
  
  router.delete('/:reviewId', catchAsync(async(req,res)=>{
    const{id,reviewId}=req.params;
    await Recipe.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","successfully deleted a review");
    res.redirect(`/recipes/${id}`);
  }))
  module.exports = router;