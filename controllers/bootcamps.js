const Bootcamp = require('../models/bootcamps')
const path = require('path')
const ErrorResponse = require('../utils/errorResponse')
const geocoder = require('../utils/geocoder')
const asyncHandler = require('../middlewares/async')
const apifilters = require('../utils/apiFilters')


////create a bootcamp
exports.createBootcamp = asyncHandler( async (req, res, next)=>{
   
    const bootcamp = await Bootcamp.create(req.body)

    res.status(200).json({
        success: true,
        bootcamp
    })
})

//get all the bootcamps available
exports.getBootcamps =  async (req, res, next)=>{

    try{
        const api = new apifilters(Bootcamp.find().populate('courses'), req.query)
                    .filter()
                    .select()
                    .sort()
                    .pagination()

        //const pagination = new apifilters(Bootcamp.find(), req.query).pagination().paginations

    const bootcamps = await api.query

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        bootcamps
    })
    }catch(err){
        console.log(err)
    }
    
}

//get bootcamp by id
exports.getBootcamp = asyncHandler( async (req, res, next)=>{
        const bootcamp = await Bootcamp.findById(req.params.id)

        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp requested not found`, 404))
        }

        res.status(200).json({
            success: true,
            bootcamp
        })
})

//get bootcamp around a given location and radius
exports.getBootcampInRadius = asyncHandler( async (req, res, next)=>{

        const { zipcode, distance } = req.params

    const loc = await geocoder.geocode(zipcode)

    const lng = loc[0].longitude
    const lat = loc[0].latitude

    const radius = distance / 3963

    const bootcamps = await Bootcamp.find({
        location : {$geoWithin : {$centerSphere : [[lng, lat], radius]}}
    })

    if(!bootcamps){
        return next(new ErrorResponse('No bootcamps found within that radius', 404))
    }

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        bootcamps

    })

})

//update bootcamp details by id
exports.updateBootcamp = asyncHandler( async (req, res, next)=>{

    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp update request not found`, 400))
    }

    res.status(200).json({
        success: true,
        bootcamp
    })  
})

exports.uploadPhoto = asyncHandler (async (req, res, next)=>{

    const bootcamp = await Bootcamp.findById(req.params.id)

    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp requested not found`, 404))
    }

    if(!req.files){
        return next(new ErrorResponse(`Please select file for upload`, 404))
    }

    const file = req.files.file
    //check file is of type image we use memetype
    if(!file.mimetype.startsWith('image')){
        return next(new ErrorResponse('Please upload an image file', 400))
    }
    //check the file size not to exceed required file size
    if(file.size > process.env.PHOTO_SIZE){
        return next(new ErrorResponse(`The file upload is too large, try uploading file not more than ${process.env.PHOTO_SIZE}`, 400))
    }
    //rename the file with a uniue name to prevent overwriting
    file.name = `${bootcamp.id}_${Date.now()}${path.parse(file.name).ext}`

    //move the file to the desired location
    file.mv(`${process.env.PHOTO_PATH}/${file.name}`, err=>{
        if(err){
            console.error(err)
        }
    })

    const update = await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name })

    res.status(200).json({
        success: true,
        update
    })

})

//delete a bootcamp by id
exports.deleteBootcamp = asyncHandler( async (req, res, next)=>{
        
    const bootcamp = await Bootcamp.findById(req.params.id)

    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp requested not found`, 404))
    }

    await bootcamp.remove()

    res.status(200).json({
        success: true,
        message: "Deleted successfully"
    })
})