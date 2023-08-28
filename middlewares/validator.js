const Joi = require('@hapi/joi');
const validateResturrant = (req, res, next)=>{
    const schema  = Joi.object({
        businessName: Joi.string().required(),
        phoneNumber: Joi.string().pattern(/^[0-9]{11}$/).required(),
        adress: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
        confirmPassword: Joi.string().required()
    })

    const {error} = schema.validate(req.body);
    if (error) {
        const validateError = error.details.map((detail)=>detail.message);
        // const validateError = error.details[0].message
        res.status(409).json({
            message: validateError
        })
    } else {
        next()
    }
};

module.exports = validateResturrant;

