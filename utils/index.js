const cntrWrapper = require('./cntrWrapper');
const validateBody = require('./validateBody');
const validateUpdate = require('./validateUpdate');
const handleMongoosError = require('./handleMongoosError');
const validateFavoriteUpdate = require('./validateFavoriteUpdate');

module.exports = {
  cntrWrapper,
  validateBody,
  validateUpdate,
  handleMongoosError,
  validateFavoriteUpdate,
};
