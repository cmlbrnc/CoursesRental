
const {logger} = require('./logger');
module.exports=function (err,req,res,next) {

 
logger.log({
  level: 'error',
  message: err.message,
  metadata: err
   
  
});


  //error
  //warn
  //info
  //verbose
  //debug
  //silly

 
   res.status(500).send('Something failed');
   
 }