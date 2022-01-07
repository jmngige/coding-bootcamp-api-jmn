const Bootcamp = require('../models/bootcamps')
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
        const api = new apifilters(Bootcamp.find(), req.query)
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

//delete a bootcamp by id
exports.deleteBootcamp = asyncHandler( async (req, res, next)=>{
        
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)

    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp requested not found`, 404))
    }

    res.status(200).json({
        success: true,
        message: "Deleted successfully"
    })
})