const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../Utils');
const Joi = require('joi');


const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: emailRegex
    },
    password: {
        type: String,
        minlength: 6,
        required: true
    },
    avatarUrl: {
        type: String, 
        required: true
    },

    token: {
        type: String,
        default: ""
    }
}, { versionKey: false, timestamps: true })

userSchema.post('save', handleMongooseError)

const User = model('user', userSchema);


const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().pattern(emailRegex).required(),
    password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
  
    email: Joi.string().pattern(emailRegex).required(),
    password: Joi.string().min(6).required()
})

const schemas = {
    loginSchema,
    registerSchema
}

module.exports = {
    User,
    schemas
};
