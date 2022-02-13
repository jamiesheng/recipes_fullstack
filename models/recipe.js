const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
  name: { type: String, required: false, maxlength:50 },
  image: String,
  description: {type: String, maxlength:500},
  instruction: {type: String, maxlength:500},
  author: { type: String, required: false },
  ingredients: [
    {
      quantity: { type: String, required: false },
      name: { type: String, required: false },
      type: { type: String, required: false },
    },
  ],
  steps: [String],
  category: String,
  author:{
    type:Schema.Types.ObjectId,
    ref:'User'
  },
  reviews:[
    {
      type: Schema.Types.ObjectId,
      ref:'Review'
    }
  ]
});
//mongoose middleware
RecipeSchema.post('findOneAndDelete',async function(doc){
  if(doc){
    await Review.deleteMany({
      _id:{
        $in: doc.reviews
      }
    })
  }
})

module.exports = mongoose.model("Recipe", RecipeSchema);
