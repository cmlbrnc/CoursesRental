const mongoose= require('mongoose');
const Joi = require('@hapi/joi');
const {authorSchema} = require('./author');

const Course = mongoose.model('Course',new mongoose.Schema({
    name: {
      type: String,
      required:true,
      minlenght: 5 ,
      trim:true,
      maxlenght: 255
    },
    author: {
        type:authorSchema,
        required:true
    },
    numberInStock: {
        type:Number,
        required:true,
        min:0,
        max:255
    },
    dailyRentalRate: {
        type:Number,
        required:true,
        min:0,
        max:255
    }
  
  }));

  function validateCourse(course){

    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        authorId: Joi.objectId().required(),
        numberInStock:Joi.number().min(0).required(),
        dailyRentalRate:Joi.number().min(0).required()
    });

    return schema.validate(course);

}


exports.Course=Course;
exports.validate =validateCourse;