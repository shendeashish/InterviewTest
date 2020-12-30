const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    firstName:  {type:String,required:true}, // String is shorthand for {type: String}
    lastName: {type:String,required:true},
    email:   {type:String,required:true,unique: true},
    address: {type:String,required:true},
    mobileNumber: {type:String,required:true},
    city: {type:String,required:true},
    password:{type:String,required:true}
  });

  module.exports = mongoose.model('User',userSchema);