const Joi = require("joi");

const putSchema = Joi.object({
  name: Joi.string().messages({
    "any.required": `"name" is required"`,
    "string.empty": `"name" cannot is empty`,
    "string.base": `"name" must be string`,
  }),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),

  phone: Joi.string(),
});

module.exports = putSchema;
