const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs/promises')
const { User } = require('../models/user');

const { HttpError, ctrlWrapper, createToken } = require('../helpers');
const ImageService = require('../services/imageService');


const avatarsDir = path.join(__dirname, '../', 'public', 'avatars' )

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, "email is already in use")
    }
    const hashPassword = await bcrypt.hash(password, 10);
    
    const newUser = await User.create({ ...req.body, password: hashPassword});
    
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

const updateCurrent = async (req, res) => {
    const { file, user } = req;    
// ==========================================save local in project==================== 
//     if (file) {
//    user.avatarUrl =  await ImageService.save(file, {width:300, height: 300}, 'avatars', 'users',   user.id )
//         }
// ====================================================================================
    // ===========================Cloudinary============================
  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
    user.avatarUrl = req.file.path
    // =====================================================================
    
    Object.keys(req.body).forEach((key) => {
         user[key] = req.body[key]
    })
    const updateUser = await user.save();

    res.status(200).json({
        user: updateUser,
    })
}

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    currentUser: ctrlWrapper(currentUser),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar),
    updateCurrent: ctrlWrapper(updateCurrent)
}