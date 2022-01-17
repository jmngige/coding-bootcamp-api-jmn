const express = require('express')
const router = express.Router()

const { registerUser, loginUser, getProfile } = require('../controllers/auth')
const { protect } = require('../middlewares/auth')

router.route('/user/register')
.post(registerUser)

//login user  api/v1/user/login
router.route('/user/login').post(loginUser)

//get user profile api/v1/user/:id
router.route('/user/:id')
.get(protect, getProfile)




module.exports = router