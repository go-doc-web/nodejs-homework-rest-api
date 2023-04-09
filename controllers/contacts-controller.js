const { cntrWrapper } = require("../utils");

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../models/contacts");

const { HttpError } = require("../helpers/HttpError");

const getAllContacts = async (req, res) => {
  const result = await listContacts();
  res.status(200).json(result);
};

const getContactsById = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await getContactById(contactId);

  if (!result) {
    throw HttpError(404, `Contact with ${contactId} not found`);
  }
  res.status(200).json(result);
};

const CreateContact = async (req, res, next) => {
  const result = await addContact(req.body);
  res.status(201).json(result);
};

const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await removeContact(contactId);
  if (!result) {
    throw HttpError(404, `Contact with ${contactId} not found`);
  }
  res.status(200).json({ message: "contact deleted" });
};

const changeContacts = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await updateContact(contactId, req.body);
  if (!result) {
    throw HttpError(404, `Contact with ${contactId} not found`);
  }
  res.status(200).json(result);
};

module.exports = {
  getAllContacts: cntrWrapper(getAllContacts),
  getContactsById: cntrWrapper(getContactsById),
  CreateContact: cntrWrapper(CreateContact),
  deleteContact: cntrWrapper(deleteContact),
  changeContacts: cntrWrapper(changeContacts),
};
