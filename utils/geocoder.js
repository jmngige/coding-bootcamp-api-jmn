const NodeGeocoder = require('node-geocoder')

    const options = {
        provider: process.env.GEOCODE_PROVIDER,
        httpAdapter: 'https',
        apiKey: process.env.GEOCODE_APIKEY,
        formatter: null
    }

    const geoCoder = NodeGeocoder(options)

    module.exports = geoCoder