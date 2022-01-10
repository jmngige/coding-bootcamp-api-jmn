const express = require('express')

const router = express.Router({ mergeParams: true })

const { createCourse, getCourses, getCourse, 
    updateCourse, deleteCourse } = require('../controllers/course')

//create course route
router.route('/courses').post(createCourse)
 
////get courses in the database
router.route('/courses')
.get(getCourses)

//get courses by id
router.route('/courses/:id')
.get(getCourse)
.put(updateCourse)
.delete(deleteCourse)

module.exports = router