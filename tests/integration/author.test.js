const request =require('supertest');
const {Author} = require('../../models/author');
const {User} = require('../../models/user');
const {logger} = require('../../middleware/logger');
const mongoose=require('mongoose');
let server;

logger.info(`A-autor test start`);

describe('/api/authors',() => {
   
        beforeAll(()=>{
          server=require('../../index');
     
        })
        afterAll(async ()=>{
          await server.close();
  
          //
          await Author.remove({});
    
        });


    describe('GET /',() => {
      it('should return all author',async ()=>{
   
       await Author.collection.insertMany([
            {name:'author 1'},
            {name:'author 2'},
        ]);

       const res=await request(server).get('/api/authors');

       expect(res.status).toBe(200);
       expect(res.body.length).toBe(2);
       expect(res.body.some(a=>a.name==='author 1')).toBeTruthy();
       expect(res.body.some(a=>a.name==='author 2')).toBeTruthy();

       

      });
    });
    describe('GET /:id',()=>{

        it('should return a author if valid id is passed',async ()=>{

     

        const author=new Author({name:'author1'});
        await author.save();

        const res=await request(server).get('/api/authors/'+author._id);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('name',author.name);

       });
        it('should return 404 if no genre with the given id exist',async ()=>{
            
        const id=mongoose.Types.ObjectId();

        const res=await request(server).get('/api/authors/'+id);

        expect(res.status).toBe(404);
       

       });

    });


    describe('POST /',()=>{

       let token;
       let name;

    

        const exec = async () => {
               
            logger.info(`Aserver called `);
          
          return await request(server)
            .post('/api/authors')
            .set('x-auth-token',token)
            .send({name});
            
        }

        beforeEach(() => {

          
            token= new User().generateAuthToken();
            name='author11';
        })



        it('should return 401 if client is not logged in',async ()=>{
     
            token='';

        const res= await exec();

        expect(res.status).toBe(401);

       });
        it('should return 400 if genre is less than 5 characters',async ()=>{
        
            name='124';

             const res=await exec();

            expect(res.status).toBe(400);

       });
       
        it('should return 400 if author is max than 50 characters',async ()=>{
        
             name=new Array(54).join('a');

            const res=await exec();

            expect(res.status).toBe(400);

       });
        it('should save the author if it is valid',async ()=>{
            
       
           await exec();

          const author=  await Author.find({name:'author11'})

          expect(author).not.toBeNull();

       });
        it('should return the author if it is valid',async ()=>{
          
           const res=await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name','author11');

       });
       

    });
})