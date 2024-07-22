const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const { HttpError, ctrlWrapper } = require('../utils')

const { SECRET_KEY_TOKEN } = process.env;

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, "email is already in use")
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({...req.body, password: hashPassword});
    res.status(201).json({
        name: newUser.name,
        email: newUser.email
    })
    
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log(user)
    if (!user) {
        throw HttpError(401, "Email or password is invalid")
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
       throw HttpError(401, "Email or password is invalid") 
    }

    const payload = {
        id: user.id
    }
    const token = jwt.sign(payload, SECRET_KEY_TOKEN, {expiresIn: "23h"})

    await User.findByIdAndUpdate(user._id, {token});
    res.json({
        name: user.name,
        email: user.email,
        token
    })

} 

const currentUser = async (req, res) => {
    const {email, name} = req.user;

    res.json({
        name, 
        email
    })
}

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: '' });
    res.json({
        message: 'Logout succes'
    })
}

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    currentUser: ctrlWrapper(currentUser),
    logout: ctrlWrapper(logout)
}