const express = require("express");

const router = express.Router();

const {
  getAllContacts,
  getContactsById,
  CreateContact,
  deleteContact,
  changeContacts,
} = require("../../controllers/contacts-controller");

const { validateBody, validateUpdate } = require("../../utils/");

const { addSchema, putSchema } = require("../../schemas");

// Get All Contacts

router.get("/", getAllContacts);

// Get Contacts by ID

router.get("/:contactId", getContactsById);

// Add Contacts

router.post("/", validateBody(addSchema), CreateContact);

// Delete contacts

router.delete("/:contactId", deleteContact);

// Change contact

router.put("/:contactId", validateUpdate(putSchema), changeContacts);

module.exports = router;
