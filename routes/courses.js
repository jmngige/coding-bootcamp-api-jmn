const express = require('express')

const router = express.Router({ mergeParams: true })

const { createCourse, getCourses, getCourse, 
    updateCourse, deleteCourse } = require('../controllers/course')

const { protect } = require('../middlewares/auth')

//create course route
router.route('/courses').post(protect, createCourse)
 
////get courses in the database
router.route('/courses')
.get(getCourses)

//get courses by id
router.route('/courses/:id')
.get(getCourse)
.put(protect, updateCourse)
.delete(protect, deleteCourse)

module.exports = router