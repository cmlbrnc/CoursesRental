
const asyncMiddleware = require('../middleware/async');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const express = require('express');
const {Author,validate} = require('../models/author');
const router =express.Router();

  router.get('/',async (req,res)=>{

    throw new Error('Could not get the authors');

    res.send(await Author.find().sort('name'));
   

    
  });
  
  router.get('/:id', async (req,res)=>{
    const author=await Author.findById(req.params.id)
     // let: reset later 
     if(!author){ return res.status(404).send('The course with the given ID not found')} // 404 object not found
  
     res.send(author);
    
   });
  
   router.post('/',auth, async (req,res) => {
  
      const {error} = validate(req.body); // object destructuring
       
      if(error){
          //400 bad request
         
            
          return  res.status(400).send(error.details[0].message);;
      }
     
      let author = new Author({ name: req.body.name ,bio:req.body.bio, website:req.body.website });
  
      author=await author.save();
      res.send(author);
       
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
  
  
  
     const author=await Author.findByIdAndUpdate(req.params.id, {
       name: req.body.name

     },{new :true})
     
      
     if(!author){
       
       return res.status(404).send('The course with the given ID not found');
     }
    
  
      //Return the updated course
  
      res.send(author);
  
  });
  router.delete('/:id',[auth,admin],async (req,res)=>{
    
    const author=await Author.findByIdAndDelete(req.params.id)
     
       //if not existing, return 404
      if(!author) {return res.status(404).send('The course with the given ID not found');}
      
   
  
      res.send(author);
  
  });
  
  

  module.exports = router;