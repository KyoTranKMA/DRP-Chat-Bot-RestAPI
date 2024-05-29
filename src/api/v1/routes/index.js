'use strict'

const express = require('express');
const router = express.Router();


router.use('/v1/api', require('./access/auth'))
router.use('/v1/api', require('./conversation/chat'))
router.use('/v1/api', require('./recipe/index'))
module.exports = router