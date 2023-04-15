const { Schema, model } = require('mongoose');
const Joi = require('joi');
const { handleMongoosError } = require('../utils');

const numberExample = /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/;

const contactSchema = new Schema(
  {
    name: {
      type: String,
      lowercase: true,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
      math: numberExample,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post('save', handleMongoosError);

const Contact = model('contact', contactSchema);

const addSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': `"name" is required"`,
    'string.empty': `"name" cannot is empty`,
    'string.base': `"name" must be string`,
  }),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
});

const putSchema = Joi.object({
  name: Joi.string().messages({
    'any.required': `"name" is required"`,
    'string.empty': `"name" cannot is empty`,
    'string.base': `"name" must be string`,
  }),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net'] },
  }),

  phone: Joi.string(),
  favorite: Joi.boolean(),
});

const updateFavoritesSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const schemas = {
  addSchema,
  putSchema,
  updateFavoritesSchema,
};

module.exports = {
  Contact,
  schemas,
};
