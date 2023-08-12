const {MongoClient} = require('mongodb')

//this is used to establish a connection with database
let dbconnection


module.exports={
  connectToDb:(cb)=>{ //this cb is the function that we want to run after connection is established

    MongoClient.connect('mongodb://localhost:27017/bookdb').then((client)=>{
                    dbconnection=client.db()
                    return cb() //cb is baiscally call back function
    }).catch(err=>{
        console.log(err)
        return cb(err)
    }) //this is used to connect with the local server in our system. For otherconnection we use connection string in mongo atlas web service

} ,

//this is used to return the conncetion to the databse with this function
  getDb:()=>dbconnection
}

