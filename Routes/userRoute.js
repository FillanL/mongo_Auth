const express = require('express');
const router = express.Router();
const User = require('../Controller/UserController')
// const Auth = require('../Controller/AuthController')
const checkAuth = require('../Middlewares/userAuth')

router.post('/newUser',User.createUser)
router.post('/login',User.logIn)
// router.get('/refreshToekn', Auth.genRefreshToken)
router.post('/findUserById', checkAuth,User.findUserById)
router.get('/findUserByEmail',checkAuth,User.findUserByEmail)
router.delete('/deleteUser', checkAuth)

module.exports = router