

const express = require('express');
const helmet = require('helmet');

const courses = require('../routes/courses');
const authors = require('../routes/authors');
const customers = require('../routes/customers');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const auth = require('../routes/auth');
const home = require('../routes/home');

const  error= require('../middleware/error');

module.exports = function(app) {

 
app.use(express.json());  //parsing body of request
app.use(express.urlencoded({extended:true}));  //parsing url encoded 
app.use(express.static('public')); // all static assets going there ...css etc.
app.use('/api/courses',courses);
app.use('/api/authors',authors);
app.use('/api/customers',customers);
app.use('/api/rentals',rentals);
app.use('/api/users',users);
app.use('/api/auth',auth);
app.use('/',home);
app.use(helmet());
app.use(error);  ///dont calling its passing

}

