const mongoose = require("mongoose");
const validator = require('validator')
const slugify = require('slugify')
const geocoder = require('../utils/geocoder')

const bootcampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add the bootcamp name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Bootcamp name cannot be more than  50 characters']
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Please add the bootcamp description'],
        trim: true,
        maxlength: [500, 'Bootcamp name cannot be more than  50 characters']
    },
    website: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Please use a valid url with http or https'
        ]
    },
    phone: {
        type: String,
        maxlength: [20, 'Number exceeds the required number']
    },
    email: {
        type: String,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Please provide a valid email address")
            }
        } 
    },
    address: {
        type: String,
        required: [true, 'Please provide an address']
    },
    location: {
        //GeoJson
        type: {
            type: String,
            enum: ['point'],
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        formattedAddress: String,
        state: String,
        street: String,
        city: String,
        zipcode: String,
        country: String

    },
    careers: {
        type: [String],
        required: true,
        enum: [
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Database Administration',
            'Other'
        ]
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating cannot be less than 1'],
        max: [10, "Rating cannot be more than 10"]
    },
    averageCost: Number,
    photo: {
        type: String,
        default: 'No-photo.jpg'
    },
    housing: {
        type: Boolean,
        default: false
    },
    jobAssistance: {
        type: Boolean,
        default: false
    },
    jobGurantee: {
        type: Boolean,
        default: false
    },
    acceptGi: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
    

},
{
    toJSON: {virtuals: true},
    toObject : {virtuals: true}
})

bootcampSchema.pre('save', function(next){
    this.slug = slugify(this.name, { lower: true})
    next()
})

bootcampSchema.pre('save', async function(next){

    const loc = await geocoder.geocode(this.address)

     this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        state: loc[0].state,
        street: loc[0].street,
        city: loc[0].city,
        zipcode: loc[0].zipcode,
        country: loc[0].country
    }

    this.address = undefined

    next()
})

bootcampSchema.virtual('courses',{
    ref: 'Course',
    localField: '_id',
    foreignField: 'bootcamp',
    justOne: false
})

//delete courses associated with a bootcamp once the bootcamp has been deleted
bootcampSchema.pre('remove', async function(next){
    await this.model('Course').deleteMany({bootcamp: this._id})
    next()
})

module.exports = mongoose.model('Bootcamp', bootcampSchema)