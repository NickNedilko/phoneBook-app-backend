const { Schema, model } = require('mongoose');
const crypto = require('crypto');
const { handleMongooseError } = require('../helpers');
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
    },

    token: {
        type: String,
        default: ""
    }
}, { versionKey: false, timestamps: true })


userSchema.pre('save', async function (next) {
    if (this.isNew) {
        const emailHash = crypto.createHash('md5').update(this.email).digest('hex');
        this.avatarUrl = `https://www.gravatar.com/avatar/${emailHash}?d=monsterid`
    }
    next();
})

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
