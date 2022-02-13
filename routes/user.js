const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

router.get('/register',(req,res)=>{
    res.render('users/register')
})
router.post('/register',catchAsync(async(req,res,next)=>{
    try{
    const {email, username, password} = req.body;
    const user = new User({email,username,password});
    //already hashed password
    const registeredUser = await User.register(user,password);
    //log in the just registered user 
    req.login(registeredUser,err=>{
        if(err) return next(err);
        req.flash("success","Welcome to 2CoolToCook!");
        res.redirect('/recipes');
    });
    
    }catch(e){
        req.flash('error', e.message);
        res.redirect('register');
    }
    
}));

router.get('/login',(req,res)=>{
    res.render('users/login');
})
//passport middleware
router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{
    req.flash('success','welcome back!');
    const redirectUrl = req.session.returnTo||'/recipes';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash("success","Successfully logged out!")
    res.redirect('/recipes');
})
module.exports = router;