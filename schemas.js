const Joi=require('joi');
module.exports.recipeSchema=Joi.object({

    name: Joi.string().max(50,'utf-8').required(),
    image: Joi.string(),
    instruction: Joi.string(),
    ingredients: Joi.array().max(50).required(),
    steps: Joi.array().max(50).required(),
    description: Joi.string().max(500,'utf-8').required()
    
});

module.exports.reviewSchema=Joi.object({
review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    body: Joi.string().max(140,'utf-8').required()
}).required()
})


