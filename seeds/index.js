//delete everything in our database and
//create seed data
const mongoose = require("mongoose");
const Recipe = require("../models/recipe");
const recipes = require("./recipes");

mongoose
  .connect("mongodb://localhost:27017/yelp-recipe")
  .catch((error) => handleError(error));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});
const seedDB = async () => {
  await Recipe.deleteMany({});
  for (let i = 0; i < recipes.length; i++) {
    const rec = new Recipe({
      name: recipes[i].name,
      ingredients: recipes[i].ingredients,
      steps: recipes[i].steps,
      description: recipes[i].desciption,
      image: recipes[i].imageURL,
      instruction: recipes[i].instruction,
      author:'6201d1905d70d3d66695fa84'
    });
    await rec.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
