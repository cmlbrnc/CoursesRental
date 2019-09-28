
const {logger} = require('../middleware/logger');
var mongoose = require('mongoose');

module.exports = function () {

mongoose.connect('mongodb://localhost/playground')
.then(() => logger.info('Connected to MongoDB...'))

}