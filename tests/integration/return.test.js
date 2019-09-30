const {Rental} =require('../../models/rental');
const {User} =require('../../models/user');
const {Course} =require('../../models/course');
const request=require('supertest');
const mongoose= require('mongoose');
const moment= require('moment');
const {logger} = require('../../middleware/logger');

describe('/api/returns',()=>{
  let myserver;  
  let customerId;  
  let courseId;  
  let rental;
  let token;
  let course;

  const exec =  async () => {
    logger.info(`Customer Id:exec ${customerId}`);
    return  await request(myserver)
         .post('/api/returns')
         .set('x-auth-token',token)
         .send({customerId,courseId});
         
     }
    beforeEach(async ()=>{  
        myserver=require('../../index');
        customerId=mongoose.Types.ObjectId();
        courseId=mongoose.Types.ObjectId();
        logger.info(`Customer Id: befor all ${customerId}`);
      
   
        token=new User().generateAuthToken();
        
        course=new Course({
            _id:courseId,
            name:'12345',
            dailyRentalRate:2,
            author:{name:'123445'},
            numberInStock:10

        })

        await course.save();
         

         rental=new Rental({
            customer:{
                _id:customerId,
                name:'123345',
                phone:'12345'
            },
            course:{
                _id:courseId,
                name:'12345',
                dailyRentalRate:2
            }
        });
        await rental.save();
     
    });

    afterEach( async ()=>{ 

        await myserver.close();  
        
        await Rental.remove({});
        await Course.remove({});
  
        
    });


    it('should return 401 if client is not logged in',async ()=>{
       
       token='';
       const res= await exec();

       expect(res.status).toBe(401);
    })
    it('should return 400 if customerID is not provided',async ()=>{
 
        customerId='';
    //  delete payload.customerId;
      const res= await exec();

       expect(res.status).toBe(400);
    });
    it('should return 400 if courseId is not provided',async ()=>{
       
        logger.info(`Customer Id:TEST ${customerId}`);
        logger.info(`COurse Id:TEST ${courseId}`);
        
        courseId='';

        const res= await exec();
  
         expect(res.status).toBe(400);
        
    
 
    });
    it('should return 404 if no rental found for the customer/courses',async ()=>{
       
        await Rental.remove({});
       
        const res=await exec();

         expect(res.status).toBe(404);
    });
    it('should return 400 if return is already processed',async ()=>{
       
        rental.dateReturned= new Date();

        await rental.save();
       
        const res=await exec();

         expect(res.status).toBe(400);
    });

    it('should return 200 if valid resquest',async ()=>{
       
      
        const res=await exec();

         expect(res.status).toBe(200);
    });

    it('should set the returnDate  if input is valid',async ()=>{
       
        
        const res=await exec();

        const rentalInDb=await Rental.findById(rental._id);
       
         const diff= new Date()-rentalInDb.dateReturned;

         logger.info(`rentalInDb Date: ${rentalInDb.dateReturned}`);

         expect(diff).toBeLessThan(10*1000);
    });
    it('should set the rentalFee  if input is valid',async ()=>{
       
        rental.dateOut=moment().add(-7,'days').toDate(); //7
        await rental.save();
        
        const res=await exec();

        const rentalInDb=await Rental.findById(rental._id);
       

         expect(rentalInDb.rentalFee).toBe(14);
    });
    it('should increase the course stock  if input is valid',async ()=>{
       
     
        const res=await exec();

        const courseInDb=await Course.findById(courseId);
       

         expect(courseInDb.numberInStock).toBe(course.numberInStock+1);
    });
    it('should return the rental body of the res  if input is valid',async ()=>{
       
     
        const res=await exec();

        const rentalInDb=await Rental.findById(rental._id);
       

         /* expect(res.body).toHaveProperty('dateOut');
         expect(res.body).toHaveProperty('dateReturned');
         expect(res.body).toHaveProperty('rentalFee');
         expect(res.body).toHaveProperty('customer');
         expect(res.body).toHaveProperty('course'); */
         expect(Object.keys(res.body)).toEqual(
             expect.arrayContaining(['dateOut','dateReturned','rentalFee','customer','course'])
         );

    });
 
});