const mongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const state ={db: null}

const { MongoClient } = require('mongodb');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000

const uri = process.env.MONGO_URI;
//const client = new MongoClient(uri);

module.exports.connect = function(done)
{
    const dbname = 'ecommerse';

    // client.connect(err => {
    //     if(err){ console.error(err); return false;}
    //     // connection to mongo is successful, listen for requests
    //     app.listen(PORT, (data) => {
    //         state.db = data.db(dbname);
    //         console.log("listening for requests");
    //     })
    // })

    mongoClient.connect(uri,(err,data)=>
    {
        if(err)
        {return done(err);}
        state.db = data.db(dbname);
        done();
    })
}
module.exports.get = function()
{
    return state.db;
}