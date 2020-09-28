const express = require('express');
const router = express.Router();
const Auth = require('../Controller/AuthController')
const checkAuth = require('../Middlewares/userAuth')

router.get('/refreshToken', Auth.genRefreshToken)
router.get('/isAuth',checkAuth, Auth.validAuth)


module.exports = router