const Joi = require('joi');

// Register Validation
const registerValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().required(),
        address: Joi.string().required(),
        role: Joi.string().required(),
        password: Joi.string().min(6).required(),
        address: Joi.object({
            address_components: Joi.array().items(Joi.object()),
            formatted_address: Joi.string(),
            geometry: Joi.object({
                location: Joi.object()
            }),
            place_id: Joi.string(),
            html_attributions: Joi.array().items(Joi.string())
        })
    });

    return schema.validate(data);
};

//Company Register Validation
const registerCompanyValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().required(),
        businessLicense: Joi.string().required(),
        role: Joi.string().required(),
        password: Joi.string().min(6).required(),
        address: Joi.object({
            address_components: Joi.array().items(Joi.object()),
            formatted_address: Joi.string(),
            geometry: Joi.object({
                location: Joi.object()
            }),
            place_id: Joi.string(),
            html_attributions: Joi.array().items(Joi.string())
        })
    });

    return schema.validate(data);
};

// Login Validation
const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    });

    return schema.validate(data);
};

module.exports.registerCompanyValidation = registerCompanyValidation;
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
