const { Schema, model } = require('mongoose');
const Joi = require('joi');
const { handleMongoosError } = require('../utils');

const emailRegexp = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

const subscrEnum = ['starter', 'pro', 'business'];

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      math: emailRegexp,
      unique: true,
    },
    subscription: {
      type: String,
      enum: subscrEnum,
      default: 'starter',
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false }
);

userSchema.post('save', handleMongoosError);

const usersSchema = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().pattern(emailRegexp).required(),
  subscription: Joi.string(),
  token: Joi.string(),
});

const User = model('user', userSchema);

const schemas = {
  usersSchema,
};

module.exports = {
  schemas,
  User,
};
