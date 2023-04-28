const express = require('express');
const validateBody = require('../../utils/validateBody');
const { schemas } = require('../../models/user');

const router = express.Router();

// signup
router.post('/register', validateBody(schemas.usersSchema));

module.exports = router;
