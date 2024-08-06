const { Schema, model } = require('mongoose');
const crypto = require('crypto');
const { handleMongooseError } = require('../helpers');
const Joi = require('joi');
const bcrypt = require('bcrypt');


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

    passwordResetToken: String,
    passwordResetExpires: Date,

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

    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);

    next();
})

// custom method

userSchema.methods.checkPassword = async (candidate, hash) => await bcrypt.compare(candidate, hash);

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
}

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
