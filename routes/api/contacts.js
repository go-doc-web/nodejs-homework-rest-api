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
} = require('../../utils/');

const {
  schemas: { addSchema, putSchema, updateFavoritesSchema },
} = require('../../models/contact');

// Get All Contacts

router.get('/', getAllContacts);

//  Get Contacts by ID

router.get('/:contactId', getContactsById);

// Add Contacts

router.post('/', validateBody(addSchema), CreateContact);

// Delete contacts

router.delete('/:contactId', deleteContact);

// Change contact

router.put('/:contactId', validateUpdate(putSchema), changeContacts);

router.patch(
  '/:contactId/favorite',
  validateFavoriteUpdate(updateFavoritesSchema),
  updateStatusContact
);

module.exports = router;
