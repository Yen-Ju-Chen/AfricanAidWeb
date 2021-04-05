const Joi = require('joi');

module.exports.itemSchema = Joi.object({
item: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().required(),
    seller: Joi.string().required(),
    description: Joi.string().required()
}).required()
})