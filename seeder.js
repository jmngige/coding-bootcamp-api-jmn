const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
require('colors')
const Bootcamp = require('./models/bootcamps')

dotenv.config({ path: './config/.env'})

 mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true
})

const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'))


const importData = async ()=>{
    try{
        await new Bootcamp(bootcamps)
        console.log('Data created successfully'.green.inverse)
        process.exit()
    }catch(err){
        console.log(err.red)
    }
}

const deleteData = async ()=>{
    try{
        await Bootcamp.deleteMany(bootcamps)
        console.log('Data deleted successfully'.red.inverse)
        process.exit()
    }catch(e){
        console.log(e.red)
    }
}

if(process.argv[2] === '-i'){
    importData()
}else if(process.argv[2] === '-d'){
    deleteData()
}

console.log(process.argv)



