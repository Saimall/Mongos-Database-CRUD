const express = require('express');

const {connectToDb,getDb} = require('./connect.js')
const {ObjectId} = require('mongodb');
//inti app & middleware
const app = express();


//db connection
//the call back function expects that if connection is succefully we want to listen to express app other wise we will thorugh error
//if error is null then it seems like the conncetion is successfully then we can listen to the port 3000 .we need to check the condition

let db; //after succefully connection we need to call the  getdb function to get the databse varibale and store in db in app.js
connectToDb((err)=>{
     if(!err){
        app.listen(3000, ()=>{
            console.log("app listening on port 3000");
        })
        db=getDb() //return database object which is used to fetch ,update and delete data
     }    
}) 



//routes

app.get('/books',async (request,response)=>{ 
    let books=[];
//find or sort return cursor ponting to a set of documents if we want to access the document weneed to iterate using forEach or toArray methods
//for reach is aysysnchrones to it takes some time to fetch becuase it is fetching like batches so we can use "then" method or we can use await and asysnc to get data     
await db.collection('books').find().sort({author:1}).forEach(book => {
        books.push(book);
    });
    return response.json({books})
})


app.get('/books/:id',async(request,response)=>{
    //we need to use ObjectId to convert the request.paramas.id which is in string into ID
   //the id should be 12 characters and 24 hexa charcters
    if(!ObjectId.isValid(request.params.id)){
        return response.json({message:"invalid ID"})
    }
    const id = new ObjectId(request.params.id);
   
    const book = await db.collection('books').findOne({_id:id});
    return response.json(book);
})