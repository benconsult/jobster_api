

const express = require('express')
const router = express.Router()
const authenticatedUser = require('../middleware/authentication')
//import controller methods
const {register,login, updateUser} = require('../controllers/auth')

//method 2
router.post('/register',register)
router.post('/login',login)
router.patch('/updateUser',authenticatedUser,updateUser)

module.exports = router