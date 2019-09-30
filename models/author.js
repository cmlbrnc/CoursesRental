const mongoose= require('mongoose');
const Joi = require('@hapi/joi');

const authorSchema= new mongoose.Schema({
    name: {
      type: String,
      required:true,
      minlenght: 5 ,
      maxlenght: 50
    },
    bio : {
        type: String,
       
        minlenght: 5 ,
        maxlenght: 500
    },

    website: {
        type: String,
     
        minlenght: 5 ,
        maxlenght: 50
      }

  });

const Author = mongoose.model('Author',authorSchema);


  
  function validateAuthor(author){
  
    const schema = Joi.object({
       name: Joi.string().min(4).max(50).required()
       
    });

    return schema.validate(author);

}

exports.Author=Author;
exports.validate =validateAuthor;
exports.authorSchema =authorSchema;

