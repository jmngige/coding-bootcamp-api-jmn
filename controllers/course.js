const Course = require('../models/course')
const asyncHandler = require('../middlewares/async')
const apifilters = require('../utils/apiFilters')
const ErrorResponse = require('../utils/errorResponse')



//create course route
exports.createCourse = async (req, res, next)=>{

    const course = await Course.create(req.body);

    res.status(201).json({
        success: true,
        course
    })
}

//get courses
exports.getCourses = asyncHandler( async( req, res, next)=>{

    let query
    //req.body.bootcamp = req.params.bootcampId
    if(req.params.bootcamp){

        query = Course.find({bootcamp: req.params.bootcamp})


    } else {
        query = Course.find()
    }

        const courses = await query
     
        if(!query){
            return next(new ErrorResponse('no courses found at the moment', 404))
        }

        res.status(200).json({
            success: true,
            count: courses.length,
            courses
        })


})

exports.getCourse = async (req, res, next)=>{

    const course = await Course.findById(req.params.id).populate('bootcamp')

    if(!course){
        return next(new ErrorResponse('Bootcamp with that id not found', 404))
    }

    res.status(200).json({
        success: true,
        course
    })
}

//update course details
exports.updateCourse = asyncHandler( async (req, res, next)=>{
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if(!course){
        return next(new ErrorResponse('No course found', 404))
    }

    res.status(200).json({
        success: true,
        course
    })
})

//delete course
exports.deleteCourse = asyncHandler( async (req, res, next)=>{
    const course = await Course.findById(req.params.id)

    if(!course){
        return next(new ErrorResponse('Course with that id not found', 404))
    }

    course.remove()

    res.status(200).json({
        success: true,
        message: 'Course deleted successfully'
    })
})