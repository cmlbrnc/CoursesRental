const request=require('supertest');
const {User} = require('../../models/user');
const {Author} = require('../../models/author');
const {logger} = require('../../middleware/logger');
let  myserver;
logger.info(`B-auth test start`);
describe('auth middleware',() => {

  
 
    beforeAll(()=>{  
        myserver=require('../../index');
        logger.info(`B-calling server`);
    });

    afterAll( async ()=>{ 

        await myserver.close();  
        
        logger.info(`B-calling close server`);

        await Author.remove({});
        logger.info(`B-Author removed `);
        
    });
          
   
    const exec =  () => {

     return  request(myserver)
          .post('/api/authors')
          .set('x-auth-token',token)
          .send({name:'author1'});
          
      }

      let token;
      beforeEach(()=>{  
    
    
        token=new User().generateAuthToken();
       
        });


    it('should return 401 if no token is provided',async ()=>{
        token='';
     const res= await exec();
     expect(res.status).toBe(401);
    });
    it('should return 400 if token is invalid',async ()=>{
        token='sdfdf';
     const res= await exec();
     expect(res.status).toBe(400);
    });
    it('should return 200 if token is valid',async ()=>{
 
     const res= await exec();
     expect(res.status).toBe(200);
    });
   

  
  

});