const express = require('express');
const ctrl = require('../../controllers/contacts');
const { isValidId, validateBody, authenticate } = require('../../middlewares');


const router = express.Router();

router.get('/', authenticate, ctrl.getAll);

router.get('/:id', authenticate, isValidId, ctrl.getById);

router.post('/', authenticate, ctrl.add);

router.put('/:id',authenticate, isValidId, ctrl.updateById);

router.patch('/:id/name', authenticate, isValidId, ctrl.updateName)

router.delete('/:id',authenticate, isValidId, ctrl.deleteById)






module.exports = router; 