

const express = require('express')
const router = express.Router()
//import controller methods
const {register,login} = require('../controllers/auth')

//method 2
router.post('/register',register)
router.post('/login',login)

module.exports = router