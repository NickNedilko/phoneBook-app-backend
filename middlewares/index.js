const  validateBody  = require('./validateBody');
const isValidId = require('./isValidId');
const authenticate = require('./authenticate');
const uploadMiddleware = require('./uploadCloudinary');
const checkMyPassword = require('./checkPassword')


module.exports = {
    validateBody,
    isValidId,
    authenticate,
    uploadMiddleware,
    checkMyPassword
}