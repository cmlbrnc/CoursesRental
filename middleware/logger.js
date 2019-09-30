const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label ,simple,prettyPrint } = format;
require('winston-mongodb');
 const logger=createLogger({
  format: combine(
    simple(),
    label({ label: 'My Logger' }),
    timestamp(),
    prettyPrint()
  ),
  transports: [ //new transports.Console(),
    new transports.File({ filename: 'combined.log' }),
    new transports.MongoDB({
      db: 'mongodb://localhost:27017/playground',
      collection: 'logs',
      storeHost: true,
      //levet:'info'
     
    })
  
  ]
});

module.exports.logger=logger;
