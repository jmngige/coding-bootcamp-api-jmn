const User = require('../models/user')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')
const sendToken = require('../utils/saveToken')


exports.registerUser = asyncHandler (async (req, res, next)=>{

    const { name, email, password, role } = req.body

    const user = await User.create({
        name,
        email,
        password,
        role
    })

    sendToken(user, 201, res)
})

exports.loginUser = async (req, res, next)=>{

    const { email, password } = req.body

    if(!email || !password ){
        return next(new ErrorResponse('Please provide email and password for logging in', 404))
    }

     const user = await User.findOne({email}).select('+password')

    if(!user){
        return next(new ErrorResponse('Invalid email or password provided', 404))
    }

    const isMatch = await user.comparePWD(password)

    if(!isMatch){
        return next(new ErrorResponse('Invalid email or password provided', 404))
    }

    

    sendToken(user, 200, res)
   

}