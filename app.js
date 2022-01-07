const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const dbConnect = require('./config/db')
const errorHandler = require('./middlewares/error')
require('colors')


//load all the environment variables
dotenv.config({ path: './config/.env'})


const bootcamps = require('./routes/bootcamps')

//database connection
dbConnect()

//load express app
const app = express()

//implement body parser
app.use(express.json())

//implement middlewares
//if(process.env.NODE_ENV === 'development'){
    //app.use(morgan('dev'))
//}

//load express routes
app.use('/api/v1', bootcamps)


//initialize error handling middleware
app.use(errorHandler)

const PORT = process.env.PORT
//start server
const server = app.listen(
    PORT, 
    console.log(`Server up and running in ${process.env.NODE_ENV} mode in port ${PORT}`.yellow.bold))

//handled unhandled promise rejection in the database
server.on('unhandledRejection', (err, promise)=>{
    console.log(`Error: ${err.message}`.red)
    server.close(()=> process.exit(1))
})