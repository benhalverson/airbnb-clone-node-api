if (process.env.NODE_ENV === 'production') {
  module.exports = require('./prod');
} else {
  module.export = require('./dev');
}