
const path = require('path');
const crypto = require('crypto');

const { User } = require('../models/user');

const { HttpError, ctrlWrapper, createToken } = require('../helpers');
// const ImageService = require('../services/imageService');




const register = async (req, res) => {
    const {email} = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, "email is already in use")
    }
    
    const newUser = await User.create({ ...req.body});
    
    const signUpUser = await User.findOne({ email });
    const payload = {
        id: signUpUser.id
    }
    const token = createToken(payload);
    await User.findByIdAndUpdate(signUpUser.id, {token});
    res.status(201).json({
        token,
        user: {
              id: signUpUser.id,
              name: newUser.name,
              email: newUser.email,
        }
    })
    
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
   
    if (!user) {
        throw HttpError(401, "Email or password is invalid")
    }
    const passwordCompare = await user.checkPassword(password, user.password)
   
    if (!passwordCompare) {
       throw HttpError(401, "Email or password is invalid") 
    }

    const payload = {
        id: user.id
    }
    const token = createToken(payload);
    

    await User.findByIdAndUpdate(user._id, {token});
    res.json({
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl
        }
    })

} 


const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, {token: '' });
    res.json({
        message: 'Logout succes'
    })
}

const fogotPassword = async (req, res, next) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(200).json({
        msg: "Password reset instruction sent to email"
    })

    const otp = user.createPasswordResetToken();

    await user.save();

    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${otp}`

    console.log(resetUrl);
    
    res.status(200).json({
        msg: "Password reset instruction sent to email"
    })
}

const resetPassword = async (req, res, next) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.otp).digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
    passwordResetExpires: {$gt: Date.now()}    
    })
    
    if (!user) return next(HttpError(400, 'Token is invalid'));

    user.password = req.body.password;
    user.passwordResetToken = '';
    user.passwordResetExpires = '';

    await user.save();

    user.password = undefined;

    res.status(200).json({
        user
    })
}

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    logout: ctrlWrapper(logout),
    forgotPassword: ctrlWrapper(fogotPassword),
    resetPassword: ctrlWrapper(resetPassword),

}