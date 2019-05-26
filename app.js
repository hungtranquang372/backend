var express = require('express');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var monk = require('monk');
 
var app= express();
var router= express.Router();

var db= monk('mongodb://hung:abc123456789@cluster0-shard-00-00-1s9ya.mongodb.net:27017,cluster0-shard-00-01-1s9ya.mongodb.net:27017,cluster0-shard-00-02-1s9ya.mongodb.net:27017/hung?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true');

app.use(bodyParser.json());//de su dung req.body
app.use(bodyParser.urlencoded({extended:true}));//ma hoa req.body ,extended:true chap  nhan cac kieu object neu ko co chi sdung string va array

app.use(function(req,res,next){
    req.db= db;
    next();
})

// CORS middleware
app.use(function(req,res,next){
    res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
})

app.post('/register',function(req,res){
    req.db.collection('users').find({username: req.body.userName},function(e,data){
        console.log(data);
       if(data.length===0){
           req.db.collection('users').insert({username: req.body.userName,
        password: req.body.password},function(e,data){
            res.json({"register" : "successful"});
        })
       }
       else{
           res.json({"register": "failed"})
       }
    })
});

app.post('/login',function(req,res){
    console.log({username: req.body.userName,password: req.body.password});
    req.db.collection('users').find({username: req.body.userName,password: req.body.password},function(e,data){
        console.log(data)
        if(data.length!==0){
            res.json({"login":"successful"});
        }
        else{
            res.json({"login":"failed"})
        }
    })
})
module.exports =app;
app.listen(8080);