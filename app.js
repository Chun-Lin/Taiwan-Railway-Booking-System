const dotenv = require('dotenv')

const railway = require('./scrapers/railway/railway')

dotenv.config()

railway.railwayScript()

