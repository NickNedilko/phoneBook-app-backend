const  validateBody  = require('./validateBody');
const isValidId = require('./isValidId');
const authenticate = require('./authenticate');
const uploadMiddleware = require('./uploadCloudinary')


module.exports = {
    validateBody,
    isValidId,
    authenticate,
    uploadMiddleware
}