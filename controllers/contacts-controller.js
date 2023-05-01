const { cntrWrapper } = require('../utils');
const { Contact } = require('../models/contact');

const { HttpError } = require('../helpers/HttpError');

const getAllContacts = async (req, res) => {
  const { id } = req.user;
  const { page = 1, limit = 20, favorite = [true, false] } = req.query;
  const skip = (page - 1) * limit;

  // const { _id: owner } = req.user;
  const result = await Contact.find({ owner: id, favorite })
    .populate('owner', '_id email')
    .skip(skip)
    .limit(parseInt(limit));
  res.status(200).json(result);
};

const getContactsById = async (req, res, next) => {
  const { contactId } = req.params;

  const result = await Contact.findById(contactId);

  if (!result) {
    throw HttpError(404, `Contact  not found`);
  }
  res.status(200).json(result);
};

const CreateContact = async (req, res, next) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndRemove(contactId);
  if (!result) {
    throw HttpError(404, `Contact not found`);
  }
  res.status(200).json({ message: 'contact deleted' });
};

const changeContacts = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, `Contact  not found`);
  }
  res.status(200).json(result);
};

const updateStatusContact = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, `Contact not found`);
  }
  res.status(200).json(result);
};

module.exports = {
  getAllContacts: cntrWrapper(getAllContacts),
  getContactsById: cntrWrapper(getContactsById),
  CreateContact: cntrWrapper(CreateContact),
  deleteContact: cntrWrapper(deleteContact),
  changeContacts: cntrWrapper(changeContacts),
  updateStatusContact: cntrWrapper(updateStatusContact),
};
