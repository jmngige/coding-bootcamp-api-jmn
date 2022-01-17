const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('./async')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

exports.protect = asyncHandler ( async (req, res, next)=>{
    let token 

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){

        token = req.headers.authorization.split(' ')[1]
    }

    if(!token){
        return next(new ErrorResponse('Please register or login first', 401))
    }

    try{

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id)
        req.user = user

        next()
    }catch(err){
        return next(new ErrorResponse('Error occured please try again', 400))
    }

})


exports.authorizeRoles = (...roles)=>{
    return (req, res, next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorResponse(`${req.user.role} not authorized to perform this action`))
        }
        next()
    }
}