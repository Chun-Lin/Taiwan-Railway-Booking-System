const dotenv = require('dotenv')

const booking = require('./scrapers/2019railway/booking')

dotenv.config()

booking.bookingScript()

