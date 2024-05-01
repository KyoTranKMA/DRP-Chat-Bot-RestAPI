'use strict'

const express = require('express');
const { model } = require('mongoose');
const router = express.Router();

router.get('/', (req, res, next) => {
    return res.status(200).json( {
        message: 'Succesfully',
        status: 'OK'
    })
})

router.use('/v1/api', require('./access'))

module.exports = router