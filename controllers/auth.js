const bcrypt = require('bcrypt');
const path = require('path');
const gravatar = require('gravatar');
const fs = require('fs/promises')
const { User } = require('../models/user');

const { HttpError, ctrlWrapper, createToken } = require('../helpers');


const avatarsDir = path.join(__dirname, '../', 'public', 'avatars' )

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, "email is already in use")
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarUrl = gravatar.url(email);

    const newUser = await User.create({ ...req.body, password: hashPassword, avatarUrl });
    
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
              avatarUrl
        }
    })
    
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
   
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

const currentUser = async (req, res) => {
    const {email, name, avatarUrl, id} = req.user;

    res.json({
        id,
        name, 
        email,
        avatarUrl
    })
}

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, {token: '' });
    res.json({
        message: 'Logout succes'
    })
}

  
const updateAvatar = async (req, res) => {
    const {_id} = req.user
    const { path: tempUpload, originalname } = req.file;
    const filename = `${_id}_${originalname}`
    const resultUpload = path.join(avatarsDir, filename);
    await fs.rename(tempUpload, resultUpload);
    const avatarUrl = path.join('avatars', filename);
    await User.findByIdAndUpdate(_id, { avatarUrl });

    res.json({
        avatarUrl
    })
    
}

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    currentUser: ctrlWrapper(currentUser),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar)
}