const { HttpError } = require("../helpers");
const { User } = require("../models/user");

const checkMyPassword = async (req, res, next) => {
    const { password, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('password');
    
    if (!(await user.checkPassword(password, user.password))) {
        return next(HttpError(401, 'Current password wrong'))
    }

    user.password = newPassword;
    await user.save();
    
    next();
}

module.exports = checkMyPassword;