const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const {Rental} = require('../models/rental');
const {Course} = require('../models/course');
const Joi = require('@hapi/joi');

const express = require('express');


const router =express.Router();

 
  
   router.post('/',[auth,validate(validateReturn)], async (req,res) => {

    const rental= await Rental.lookup(req.body.customerId,req.body.courseId);
  
    if(!rental) return res.status(404).send('Rental not found');
    if(rental.dateReturned) return res.status(400).send('Return already processed.');

    //Informantion Export Priciple
     rental.return();

  
    await rental.save();

    await Course.update({_id:rental.course._id},{
      $inc:{numberInStock:1}
    });

 
    return res.send(rental);

       
   });

   function validateReturn(req){
  
    const schema = Joi.object({
       customerId: Joi.objectId().required(),
       courseId: Joi.objectId().required(),
       
    });

    return schema.validate(req);

}

  module.exports = router;