const express = require('express');

const {connectToDb,getDb} = require('./db')
//inti app & middleware
const app = express();


//db connection
//the call back function expects that if connection is succefully we want to listen to express app other wise we will thorugh error
//if error is null then it seems like the conncetion is successfully then we can listen to the port 3000 .we need to check the condition
let db //after succefully connection we need to call the  getdb function to get the databse varibale and store in db in app.js
connectToDb((err)=>{
     if(!err){
        app.listen(3000, ()=>{
            console.log("app listening on port 3000");
        })
        db=getDb() //return database object which is used to fetch ,update and delete data
     }    
}) 



//routes

app.get('/books',(request,response)=>{
    return response.json({message:"welcome to API"});
})