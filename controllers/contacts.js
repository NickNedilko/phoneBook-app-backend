const Contact = require('../models/contact');

const { HttpError, ctrlWrapper } = require('../Utils');
  


const getAll = async (req, res) => {
    const result = await Contact.find();
    res.json(result)
}

const add = async (req, res) => {
    const result = await Contact.create(req.body)
    res.status(201).json(result)
}

const getById = async (req, res) => {
    const { id }= req.params;
    const result = await Contact.findById(id);
    if (!result) {
        throw HttpError(404, 'Not found');
    }
    res.json(result);
}


const updateById = async (req, res) => {
    const { id } = req.params;
    const result = await Contact.findByIdAndUpdate(id, req.body, {new: true});
    if (!result) {
        throw HttpError(404, 'Not found');
    }
    res.json(result);
}

const deleteById = async (req, res) => {
    const { id } = req.params;
    const result = Contact.deleteById(id);

    if (!result) {
        throw HttpError(404, 'Not found');
    }
    res.json(result)
}

// patch
const updateName = async (req, res) => {
    const { id } = req.params;
    const result = await Contact.findByIdAndUpdate(id, req.body, {new: true});
    if (!result) {
        throw HttpError(404, 'Not found');
    }
    res.json('Delete success');
}


module.exports = {
    getAll: ctrlWrapper(getAll),
    add: ctrlWrapper(add),
    getById: ctrlWrapper(getById),
    updateById: ctrlWrapper(updateById),
    deleteById: ctrlWrapper(deleteById),
    updateName: ctrlWrapper(updateName)
}


