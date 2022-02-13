const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Recipe = require("../models/recipe");
const {recipeSchema} = require('../schemas.js');
const {isLoggedIn} = require('../middleware');
//create own middleware
const validateRecipe = (req,res,next)=>{
    //recipeSchema created in another file
    const {error} = recipeSchema.validate(req.body);
      if(error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
      }else{
        next();
      }
  }

  
router.get("/", catchAsync(async (req, res) => {
    const recipes = await Recipe.find({});
    res.render("recipes/index", { recipes });
  }));
  
  router.get("/new", isLoggedIn,(req, res) => {
    res.render("recipes/new");
  });
  
router.post("/", isLoggedIn,validateRecipe, catchAsync(async(req, res,next) => {
      // if(!req.body) throw new ExpressError('Invalid Recipe Data',400);
      const newRecipe = new Recipe(req.body);
      newRecipe.author = req.user._id;
      await newRecipe.save();
      req.flash("success","Successfully create a new recipe!");
      res.redirect(`/recipes/${newRecipe._id}`);
    
  }));
  
router.get("/:id", catchAsync(async (req, res) => {
    const recipe = await Recipe.findById(req.params.id).populate('reviews').populate('author');
    //recipe not exist
    if(!recipe){
      req.flash("error","Cannot find this recipe!");
      res.redirect('/recipes');
    }
    res.render("recipes/show", { recipe });
  }));
  
router.get("/:id/edit", catchAsync(async (req, res) => {
    const { id } = req.params;
    const recipe = await Recipe.findById(id);
    if(!recipe){
      req.flash("error","Cannot find this recipe!");
      res.redirect('/recipes');
    }
    res.render("recipes/edit", { recipe });
  }));
  
router.put("/:id", validateRecipe, catchAsync(async (req, res) => {
    const { id } = req.params;
    // const recipe = await Recipe.findById(id);
    // if(!recipe.author.equal(req.user_id)){
    //   req.flash('error','you do not hava permission');
    //   res.redirect(`/recipes/${recipe._id}`);
    // }
    const recipe = await Recipe.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });
    //under the key of success
    req.flash("success","Successfully updated the recipe!");
    res.redirect(`/recipes/${recipe._id}`);
  }));
  
router.delete("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const recipe = await Recipe.findByIdAndDelete(id);
    req.flash("success","successfully deleted a recipe");
    res.redirect("/recipes");
  }));

module.exports = router;