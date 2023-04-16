const express = require('express');

const router = express.Router();

const {
  getAllContacts,
  getContactsById,
  CreateContact,
  deleteContact,
  changeContacts,
  updateStatusContact,
} = require('../../controllers/contacts-controller');

const {
  validateBody,
  validateUpdate,
  validateFavoriteUpdate,
  isValidId,
} = require('../../utils/');

const {
  schemas: { addSchema, putSchema, updateFavoritesSchema },
} = require('../../models/contact');

// Get All Contacts

router.get('/', getAllContacts);

//  Get Contacts by ID

router.get('/:contactId', isValidId, getContactsById);

// Add Contacts

router.post('/', validateBody(addSchema), CreateContact);

// Delete contacts

router.delete('/:contactId', isValidId, deleteContact);

// Change contact

router.put('/:contactId', isValidId, validateUpdate(putSchema), changeContacts);

router.patch(
  '/:contactId/favorite',
  isValidId,
  validateFavoriteUpdate(updateFavoritesSchema),
  updateStatusContact
);

module.exports = router;
