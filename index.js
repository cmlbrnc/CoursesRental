const startupDebugger = require('debug')('app:startup');

const config = require('config');
const express = require('express');
const morgan = require('morgan')
const {logger} = require('./middleware/logger');
const app = express();

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();


app.set('view engine','pug');
app.set('views','./views'); //default

//process.env.NODE_ENV  // undefined
//  console.log(`NODE_ENV:${process.env.NODE_ENV}`);
//  console.log(`app:${app.get('env')}`); 

if(app.get('env')==='development'){
    app.use(morgan('tiny'));  // various option in docs
    startupDebugger('Morgan enabled...');
}

//configuration
console.log('Application Name:'+config.get('name'));
// console.log('Mail Server: '+config.get('mail.host'));
// console.log('Mail Password: '+config.get('mail.password'));


//PORT : env variables
const port=process.env.PORT || 3000;

const server=app.listen(port, ()=> logger.info(`Listening on port ${port}`) );

module.exports=server

//Test rejection error
/* // const p= Promise.reject(new Error('Something failed miserably'));
    
// p.then(() => {
//  console.log('done');
// }) ; */