const express = require('express');
const ctrl = require('../../controllers/contacts');
const { isValidId, validateBody } = require('../../middlewares');


const router = express.Router();

router.get('/', ctrl.getAll);

router.get('/:id', isValidId, ctrl.getById);

router.post('/', ctrl.add);

router.put('/:id', isValidId, ctrl.updateById);

router.patch('/:id/name', isValidId, ctrl.updateName)

router.delete('/:id', isValidId, ctrl.deleteById)






module.exports = router; 