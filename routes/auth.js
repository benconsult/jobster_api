

const express = require('express')
const router = express.Router()
const authenticatedUser = require('../middleware/authentication')
const testUser = require('../middleware/testUser')
//import controller methods
const {register,login, updateUser} = require('../controllers/auth')

//method 2
router.post('/register',register)
router.post('/login',login)
router.patch('/updateUser',authenticatedUser,testUser,updateUser)

module.exports = router