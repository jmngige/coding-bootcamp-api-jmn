
const logger = (req, res, next)=>{

    const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`
    console.log(url)
    next()
}

module.exports = logger