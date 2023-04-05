const express = require("express");
const Joi = require("joi");

const router = express.Router();

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts");

const { HttpError } = require("../../helpers");

const addSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": `"name" is required"`,
    "string.empty": `"name" cannot is empty`,
    "string.base": `"name" must be string`,
  }),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  phone: Joi.string().required(),
});

router.get("/", async (req, res, next) => {
  try {
    const result = await listContacts();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await getContactById(contactId);

    if (!result) {
      throw HttpError(404, `Contact with ${contactId} not found`);
      // const error = new Error(`Contact with ${contactId} not found`);
      // error.status = 404;
      // throw error;
      // return res.status(404).json({ message: `Contact with ${contactId} not found` });
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
    // const { status = 500, message = "Server found" } = error;
    // res.status(status).json({ message });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const result = await addContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await removeContact(contactId);
    if (!result) {
      throw HttpError(404, `Contact with ${contactId} not found`);
    }
    res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    next();
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const { contactId } = req.params;
    const result = await updateContact(contactId, req.body);
    if (!result) {
      throw HttpError(404, `Contact with ${contactId} not found`);
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
