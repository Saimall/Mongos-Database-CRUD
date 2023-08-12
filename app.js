const express = require('express');

const {connectToDb,getDb} = require('./connect.js')
const {ObjectId} = require('mongodb');
//inti app & middleware
const app = express();

app.use(express.json()) //this is baiscally passses the any josn comming from the rrequest so that we can use inside the hanlder function
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

//retriving
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

//Adding
app.post('/book',async(request,response)=>{

    const book = request.body;

    const res = await db.collection('books').insertOne(book)
    if(res){
        return response.status(200).json({message:"success"})
    }
})

//deleting
app.delete('/books/:id',async(request,response)=>{

    if(!ObjectId.isValid(request.params.id)){
        return response.json({message:"invalid ID"});
    }
    const id = new ObjectId(request.params.id);

    const res = await db.collection('books').deleteOne({_id:id});
    if(!res){
        return response.json({message:"Delete unsuccesfully"});
    }
    else{
        return response.status(200).json({message:"successfull deleted"});
    }
})

//patch is used to update individual fileds in a doucment

app.patch('/books/:id',async(request,response)=>{
    
    //we can also ge the update object from postman and can access using request.body
    
    if(!ObjectId.isValid(request.params.id)){
        return response.json({message:"Invalid ID"});
    }
    const id = new ObjectId(request.params.id);

    const res=await db.collection('books').updateOne({_id:id},{$set : {author:"saimallik",pages:550,rating:9}}); //{$set: updates}
   console.log(res)
    if(res.modifedCount==0){
    return response.json({message:"unable to update document"});
  }
  else{
    return response.json({message:"Document updated succesfully"})
  }

})