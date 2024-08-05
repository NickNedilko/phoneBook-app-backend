const express = require('express');
const { validateBody, authenticate, uploadMiddleware} = require('../../middlewares');
const { schemas } = require('../../models/user');
const ctrl = require('../../controllers/auth');
const ImageService = require('../../services/imageService');




const router = express.Router();
 

router.post('/register', validateBody(schemas.registerSchema), ctrl.register);

router.post('/login', validateBody(schemas.loginSchema), ctrl.login);

router.get('/current', authenticate, ctrl.currentUser);

router.post('/logout', authenticate, ctrl.logout);

// to save in local project file ImageService.upload('avatar')
// save to cloudinary uploadMiddleware('users').single('avatar')

router.patch('/current', authenticate, uploadMiddleware('users').single('avatar'), ctrl.updateCurrent);

router.patch('/avatars', authenticate, ctrl.updateAvatar);


module.exports = router;