const express = require('express');
const { validateBody, authenticate, upload } = require('../../middlewares');
const { schemas } = require('../../models/user');
const ctrl = require('../../controllers/auth')


const router = express.Router();
 

router.post('/register', upload.single('avatarUrl'), validateBody(schemas.registerSchema), ctrl.register);

router.post('/login', validateBody(schemas.loginSchema), ctrl.login);

router.get('/current', authenticate, ctrl.currentUser);

router.post('/logout', authenticate, ctrl.logout);

router.patch('/avatars', authenticate, upload.single('avatarUrl'), ctrl.updateAvatar);


module.exports = router;