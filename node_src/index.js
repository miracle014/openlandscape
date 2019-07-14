if (process.env.STATE == 'PROD') {
  module.exports = require('./build/server')
} else if (process.env.STATE == 'DEV') {
  module.exports = require('./src/server')
} else {
  throw new Error('No state declare.')
}