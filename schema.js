const Joi=require('joi')

module.exports.listingSchema=Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0),
        image:Joi.string().allow("",null),
        image2:Joi.string().allow("",null),
        image3:Joi.string().allow("",null),
        image4:Joi.string().allow("",null),
        image5:Joi.string().allow("",null),
        
    }).required(),
    deleteImages: Joi.array().items(Joi.string().allow(''))
})

module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(0).max(5),
        comment:Joi.string().required(),
        
    }).required()
})