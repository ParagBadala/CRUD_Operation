var http = require('http');
var express = require('express');
var parser = require('body-parser');
var exp = express();
var fs = require('fs');
var cors = require('cors');
var MongoClient = require('mongodb').MongoClient;
var dataS = require('./demo.json')

var browserData;
var appendData = [];
exp.get("/rest/api/load",cors(),(req,res)=>{
    console.log('Load Invoked');
   // res.writeHead(200,{'content-Type':'text/json'});  
    //res.write("{msg:'Give Some Rest To the World'}"); 
   //res.send({msg:'Give Some Rest To the World'});
   //res.end();

   /***************Read from Database and store in file**************/

  /* MongoClient.connect('mongodb://localhost:27017/test',function(err,dbvar){
        if(err) throw err
        var coll = dbvar.db('test')
        coll.collection('parag').find({}).toArray(function(err,result){
            if(err) throw err;
            var dbData = result;
            fs.writeFileSync('demo.json',JSON.stringify(dbData))
            console.log("1 document Read");
            dbvar.close();
        });
        dbvar.close();
    });*/


/**************Read from Database and display it on browser*****************/
     MongoClient.connect('mongodb://localhost:27017/test',function(err,dbvar){
        if(err) throw err
        var coll = dbvar.db('test')
        coll.collection('parag').find({}).toArray(function(err,result){
            if(err) throw err;
            var dbData = result;
            res.send(result);
            console.log("1 document Read");
            dbvar.close();
        });
        dbvar.close();
    });
});

/****Another way to create a url and then use get or post*****/
exp.route("/rest/api/get",cors()).get((req,res)=>{
    console.log("Get Invoked");
    res.send(JSON.stringify(dataS));
});

exp.use(parser.json());

exp.route("/rest/api/post",cors()).post((req,res)=>{
    console.log(req.body);
    //appendData.push(req.body);
    
    //fs.writeFileSync('demo.json',JSON.stringify(appendData))
   

    /*MongoClient.connect('mongodb://localhost:27017/test',function(err,dbvar){
        if(err) throw err
        var coll = dbvar.db('test')
        coll.collection('parag').insert(req.body,true,function(err,res){
            if(err) throw err;
            console.log("1 document inserted");
            dbvar.close();
        });
        dbvar.close();
    })*/


    /*******create Operation *************/

    MongoClient.connect('mongodb://localhost:27017/test',function(err,dbvar){
        if(err) throw err
        var coll = dbvar.db('test')
        var obj = req.body;
        appendData.push(obj)
        fs.writeFileSync('demo.json',JSON.stringify(appendData));
        res.status(201).send(appendData);
        coll.collection('parag').insertOne(obj,true,function(err,res){
            if(err) throw err;
            console.log("1 document inserted");
            dbvar.close();
        });
        dbvar.close();
    });
});

exp.route("/rest/api/get/:name",cors()).get((req,res)=>{
    res.send("Hello World"+req.params['name'])
})


exp.route("/rest/api/put/:id").put((req,res)=>{
    console.log("Put invoked");
    MongoClient.connect('mongodb://localhost:27017/test',function(err,dbvar){
        if(err) throw err
        var coll = dbvar.db('test')
        var match = JSON.parse('{"msg" : "'+req.params.id+'"}');
        var dataUpdate = {$set: { "msg" : "Dipmalya Sen"}}
        coll.collection('parag').updateOne(match,dataUpdate,function(err,res){
            if(err) throw err;
            console.log("1 document updated");
            dbvar.close();
        });
        coll.collection('parag').find({}).toArray(function(err,result){
         fs.writeFileSync('demo.json',JSON.stringify(result))
         //res.status(201).send(req.body);
        dbvar.close();
    });
     })
     
})


// exp.route("/rest/api/del", cors()).post((req, res) => {
//     console.log("Delete Invoked")
//     //console.log(req.body);
    
//     /*******Delete Operation *************/
//  MongoClient.connect('mongodb://localhost:27017/test', function (err, dbvar) {
//         if (err) throw err

//        var coll = dbvar.db('test');
//         coll.collection('parag').deleteOne(req.body, true, function (err, res) {
//             if (err) throw err;
//              console.log("1 document deleted from parag db");
//              dbvar.close();
//          });
//        dbvar.close();
//    })

// });

exp.use(cors()).listen(3001,()=>console.log("Running"))

