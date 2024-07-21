
const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../utils');




const contactSchema = new Schema({
    name: {
        type: String, 
        required: true
    },
    email:  {
        type: String, 
        required: true,
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    },
    phone:  {
        type: String, 
            required: true,
            match: /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/
    }
    

}, {
    versionKey: false,
    timestamps: true
} )

contactSchema.post('save', handleMongooseError)


const Contact = model('contact', contactSchema);


module.exports = Contact;