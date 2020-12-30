var express= require('express');
var app = express();
const bodyParser= require('body-parser');
var userRoute= require('./Route/UserRoute.js')
const mongoose = require('mongoose');


var port=3000;



app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) =>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-with, Content-Type, Accept, Authorization"
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods' ,'PUT,GET, POST, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
});


mongoose.connect('mongodb://localhost:27017/TestDb', {useNewUrlParser: true});

mongoose.connection.on('error',(err)=>{
    console.log("err----->",err)
})
 mongoose.connection.on('open',()=>{
     console.log("connection is created......")
 })

// mongoose.connection.on('connected',()=>{
//     console.log("connection is created......")
// })

mongoose.connection.on('disconnected',()=>{
    console.log("disconnected from DB....")
})



app.use('/users',userRoute);

app.listen(port,()=>{
console.log("server is running.........",port);
})