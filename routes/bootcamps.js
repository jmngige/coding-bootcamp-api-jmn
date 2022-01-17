const express = require('express')
const {
     getBootcamps, getBootcamp, 
     createBootcamp, updateBootcamp, 
     deleteBootcamp, getBootcampInRadius,
     uploadPhoto } = require('../controllers/bootcamps')

const { protect, authorizeRoles } = require('../middlewares/auth')

const router = express.Router()

//create a course router
const courseRouter = require('./courses')

router.use('/:bootcampId/courses', courseRouter)

//create a bootcamp
router.route('/bootcamps').post(protect, authorizeRoles('publisher', 'admin') , createBootcamp)

//get all available bootcamps
router.route('/bootcamps').get(getBootcamps)

//upload bootcamp photo
router.route('/bootcamps/:id/photo')
.put(protect, uploadPhoto)

//perform bootcamp calls by id: such as update, get, delete
router.route('/bootcamps/:id')
.get(getBootcamp)
.put(protect, updateBootcamp)
.delete(protect, deleteBootcamp)

//get bootcamps within a particular radius
router.route('/bootcamps/radius/:zipcode/:distance')
.get(getBootcampInRadius)

module.exports = router