'use strict'

const express = require('express')
const accessController = require('../../controllers/access.controller')
const router = express.Router()

//sign Up 
router.post('/sign-up', accessController.signUp)
router.get('/sign-up', (req, res, next) => {
    return res.status(200).json( {
        message: 'Succesfully',
        status: 'OK'
    })
})

module.exports = router