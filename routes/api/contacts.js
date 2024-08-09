const express = require('express');
const ctrl = require('../../controllers/contacts');
const { isValidId, validateBody, authenticate, uploadMiddleware } = require('../../middlewares');
const { schemas } = require('../../models/contact');


const router = express.Router();

router.get('/:id', authenticate,  ctrl.getAll);

router.get('/:id', authenticate, isValidId, ctrl.getById);

router.post('/:id', authenticate, validateBody(schemas.addContactSchema), ctrl.add);

router.put('/:id',authenticate, validateBody(schemas.addContactSchema), isValidId, ctrl.updateById);

router.patch('/:id/name', authenticate, isValidId, validateBody(schemas.changeNameSchema), ctrl.updateName)

router.patch('/:id/avatar', authenticate, uploadMiddleware('contacts').single('avatar'), ctrl.updatePhoto)

router.delete('/:id',authenticate, isValidId, ctrl.deleteById)






module.exports = router; 