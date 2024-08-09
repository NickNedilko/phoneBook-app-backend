
// const path = require('path');
// const fs = require('fs/promises')
// const { User } = require('../models/user');

const {  ctrlWrapper} = require('../helpers');
// const ImageService = require('../services/imageService');


// const avatarsDir = path.join(__dirname, '../', 'public', 'avatars' )



const currentUser = async (req, res) => {
    const {email, name, avatarUrl, phone, id} = req.user;

    res.json({
        id,
        name, 
        email,
        avatarUrl,
        phone
    })
}
const updateAvatar = async (req, res) => {
    const user = req.user
    // const {_id} = req.user
    // const { path: tempUpload, originalname } = req.file;
    // const filename = `${_id}_${originalname}`
    // const resultUpload = path.join(avatarsDir, filename);
    // await fs.rename(tempUpload, resultUpload);
    // const avatarUrl = path.join('avatars', filename);
    // await User.findByIdAndUpdate(_id, { avatarUrl });

    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
        user.avatarUrl = req.file.path;

        await user.save();

    res.json({
        avatarUrl: req.file.path
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

const updatePassword = (req, res) => {

    res.status(200).json({
        user: req.user
    })
}

module.exports = {
    currentUser: ctrlWrapper(currentUser),
    updateAvatar: ctrlWrapper(updateAvatar),
    updateCurrent: ctrlWrapper(updateCurrent),
    updatePassword: ctrlWrapper(updatePassword)
}