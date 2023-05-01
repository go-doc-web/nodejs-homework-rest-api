const express = require('express');

const router = express.Router();

const { authenticate } = require('../../middlewares');

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

router.get('/', authenticate, getAllContacts);

//  Get Contacts by ID

router.get('/:contactId', authenticate, isValidId, getContactsById);

// Add Contacts

router.post('/', authenticate, validateBody(addSchema), CreateContact);

// Delete contacts

router.delete('/:contactId', authenticate, isValidId, deleteContact);

// Change contact

router.put(
  '/:contactId',
  authenticate,
  isValidId,
  validateUpdate(putSchema),
  changeContacts
);

router.patch(
  '/:contactId/favorite',
  authenticate,
  isValidId,
  validateFavoriteUpdate(updateFavoritesSchema),
  updateStatusContact
);

module.exports = router;
