const mongoose = require('mongoose')


const dbConnect = async ()=> {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true
    })

    console.log(`Database connected: ${conn.connection.host}`.cyan.underline.bold)
}

module.exports = dbConnect