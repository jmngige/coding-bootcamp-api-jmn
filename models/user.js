const mongoose = require('mongoose')
const validator = require('validator')
const ErrorResponse = require('../utils/errorResponse')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please ensure you add your name']
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        required:  [true, 'Please make sure you add a valid email'],
        validate(value){
            if(!validator.isEmail(value)){
                return new ErrorResponse('Invalid email. Please provide a valid email', 400)
            }
        },
        unique: true
    },
    password: {
        type: String,
        select: false,
        required: [true, 'Please put in your account passwird'],
        minlength: 6
    },
    role: {
        type: String,
        enum: ['user', 'publisher'],
        default: 'user'
    },
    passwordResetToken: String,
    passwordResetExpiry: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
    }
    
})

userSchema.methods.generateJWT = function(){
    return jwt.sign({ id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

userSchema.methods.comparePWD = async function(ePass){
    return await bcrypt.compare(ePass, this.password)
}

module.exports = mongoose.model('User', userSchema)