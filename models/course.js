const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add course title']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    weeks :{
        type: String,
        required: [true, 'Please add a number of weeks']  
    },
    tuition: {
        type: Number,
        required: [true, 'Please add tuition for the course']
    },
    minimumSkill :{
        type: String,
        required: [true, 'Please add a number minimum Skill required'],
        enum: ['beginner', 'intermediate', 'advanced']

    },
    scholarshipAvailable :{
        type: Boolean,
        default: false
    },
    createdAt :{
        type: Date,
        default: Date.now()
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp'
    }
})

module.exports = mongoose.model('Course', courseSchema)