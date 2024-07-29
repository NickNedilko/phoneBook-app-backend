
const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');
const Joi = require('joi');

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const phoneRegex = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;

const contactSchema = new Schema({
    name: {
        type: String, 
        required: true
    },
    email:  {
        type: String, 
        required: true,
         unique: true,
        match: emailRegex
    },
    phone:  {
        type: String, 
        required: true,
             unique: true,
            match: phoneRegex
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
    

}, {
    versionKey: false,
    timestamps: true
} )

const addContactSchema = Joi.object({
    name: Joi.string().min(8).required(),
    email: Joi.string().pattern(emailRegex).required(),
    phone: Joi.string().pattern(phoneRegex).required(),
})

const changeNameSchema = Joi.object({
    name: Joi.string().min(8).required()
})

contactSchema.post('save', handleMongooseError)

const Contact = model('contact', contactSchema);

const schemas = {
    addContactSchema,
    changeNameSchema
}

module.exports = {
    Contact,
    schemas
};