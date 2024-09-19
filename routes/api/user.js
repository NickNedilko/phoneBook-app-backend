const express = require('express');
const {  authenticate, uploadMiddleware, checkMyPassword} = require('../../middlewares');

const ctrl = require('../../controllers/user');
// const ImageService = require('../../services/imageService');

const router = express.Router();
 

// to save in local project file ImageService.upload('avatar')
// save to cloudinary uploadMiddleware('users').single('avatar')
router.get('/current', authenticate, ctrl.currentUser);

router.patch('/update-current', authenticate, ctrl.updateCurrent);

router.patch('/update-password', authenticate, checkMyPassword, ctrl.updatePassword)

router.patch('/avatar', authenticate, uploadMiddleware('users').single('avatar'), ctrl.updateAvatar);


module.exports = router;