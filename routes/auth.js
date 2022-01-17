const express = require('express')
const router = express.Router()

const { registerUser, loginUser } = require('../controllers/auth')

router.route('/user/register')
.post(registerUser)

//login user  api/v1/user/login
router.route('/user/login').post(loginUser)




module.exports = router