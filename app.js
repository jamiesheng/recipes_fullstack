if(process.env.NODE_ENV !=="production"){
  require('dotenv').config();
}
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require('connect-flash');

const Joi=require('joi');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const {recipeSchema,reviewSchema} = require('./schemas.js');
const Recipe = require("./models/recipe");
const Review = require("./models/review"); 
const methodOverride = require("method-override");
const { nextTick } = require("process");
const res = require("express/lib/response");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routes/user');
const recipeground = require('./routes/recipeground');
const reviewground = require('./routes/reviewground');

const MongoStore = require('connect-mongo');

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-recipe";
 //process.env.DB_URL
// "mongodb://localhost:27017/yelp-recipe"
mongoose
  .connect(dbUrl)
  .catch((error) => handleError(error));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,'public')))

const secret = process.env.SECRET || "thisshouldbeabettersecret";
// const store = new MongoStore({
//   url:dbUrl,
//   secret:"thisshouldbeabettersecret!",
//   touchAfter:24*60*60
// });

// store.on("error",function(e){
//   console.log("SESSION STORE ERROR",e)
// })

const sessionConfig = {
  //a property called store
  //using mongo to store information
  store: MongoStore.create({
    mongoUrl:dbUrl,
    touchAfter:24*60*60
  }),
  name:"session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie:{
    httpOnly: true,
    expires: Date.now()+1000*60*60*24*7,
    maxAge:1000*60*60*24*7
  }
}
//default store is memory store
//does not scale well in production
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
//authenticate method
passport.use(new LocalStrategy(User.authenticate()))
//store user and unstore user
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

// app.get('/fakeUser',async(req,res)=>{
//   const user = new User({email:'jamie@gmail.com',username:"jamie"});
//   const newUser = await User.register(user,"doggie");
//   res.send(newUser);
// })

//route handler
app.use('/',userRoutes);
app.use("/recipes",recipeground);
app.use("/recipes/:id/reviews",reviewground);

// app.get("/", (req, res) => {
//   res.render("index");
// });


app.all("*",(req,res,next)=>{
  next(new ExpressError('Page Not Found',404))
})

app.use((err,req,res,next)=>{
  const {statusCode=500} =err;
  if(!err.message) err.message='OMO,something went wrong'
  res.status(statusCode).render('error',{err});
})

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
