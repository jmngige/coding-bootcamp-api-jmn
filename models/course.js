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

courseSchema.statics.getAverageCost = async function(bootcampId){
    const agg = this.aggregate([
        {
            $match : { bootcamp: bootcampId}
        },
        {
            $group: {
                _id : 'bootcamp',
                averageCost: { $avg: "tuition" }
            }
        }
    ])

    try{
        this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageCost: Math.ceil(agg[0].averageCost * 10) / 10
        })
    }catch(err){
        console.error(err)
    }
}

//calculate the averageCost after new save
courseSchema.post('save', function(){
    this.constructor.getAverageCost(this.bootcamp)
})

//calculate new average cost before remove operation
courseSchema.pre('remove', function(){
    this.constructor.getAverageCost(this.bootcamp)
})



module.exports = mongoose.model('Course', courseSchema)