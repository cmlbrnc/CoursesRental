

const express = require('express');
const router =express.Router();
const {Author} = require('../models/author'); 

const {Course,validate} = require('../models/course');


router.get('/',async (req,res)=>{

   res.send(await Course.find().sort('name'));
});


router.get('/:id', async (req,res)=>{
  const course=await Course.findById(req.params.id)
   // let: reset later 
   if(!course){ return res.status(404).send('The course with the given ID not found')} // 404 object not found

   res.send(course);
  
 });

 router.post('/', async (req,res) => {

    const {error} = validate(req.body); // object destructuring
     
    if(error){
        //400 bad request
        return  res.status(400).send(error.details[0].message);
    } 

   //author represent valid author id

   const author = await Author.findById(req.body.authorId);
   if(!author) return   res.status(400).send('Author not found');

   
    const course = new Course({ 
      name: req.body.name ,
      author:{
        _id:author._id,
        name: author.name
      },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
    
    });

    await course.save();
    res.send(course);
     
 });

router.put('/:id',async (req,res)=>{

  //Validate
   
  const {error} = validate(req.body); // object destructuring

  if(error){
      //400 bad request
    /*   res.status(400).send(error.details[0].message);

      return; */

      return  res.status(400).send(error.details[0].message);
  }



   const course=await Course.findByIdAndUpdate(req.params.id, {
     name: req.body.name,
     
   },{new :true})
   
    
   if(!course){
     
     return res.status(404).send('The course with the given ID not found');
   }
  

    //Return the updated course

    res.send(course);

});
router.delete('/:id',async (req,res)=>{
  
  const course=await Course.findByIdAndDelete(req.params.id)
   
     //if not existing, return 404
    if(!course) {return res.status(404).send('The course with the given ID not found');}
    
 

    res.send(course);

});







module.exports = router;