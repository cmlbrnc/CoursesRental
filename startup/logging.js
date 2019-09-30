
const winston = require('winston');
const {logger} = require('../middleware/logger');
require('express-async-errors');


module.exports = function () {

    logger.exceptions.handle(
      //  new winston.transports.Console({ colorize:true,prettyPrint:true }),
       new winston.transports.File({ filename: 'exceptions.log' })
      );
    
      process.on('unhandledRejection',(ex)=>{
     
         throw ex; }
        );
    
     
   

  }
