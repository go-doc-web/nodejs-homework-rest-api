const { isValidObjectId } = require('mongoose');

const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  console.log('Console', contactId);

  if (!isValidObjectId(contactId)) {
    return res.status(400).json({ message: 'Contact not found' });
  }
  next();
};

module.exports = isValidId;
