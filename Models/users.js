const mongoose = require('mongoose');
const Joi = require('joi');
const validator = require('validator');




const users=new mongoose.Schema({

    email:{type:String,validate:{
        validator: validator.isEmail,
        message: '{VALUE} is not a valid email',
        isAsync: false
      },required:true,unique:true,minlength:2,maxlength:50},
      password:{type:String,required:true,minlength:8,maxlength:1264},
   
})




const schema = Joi.object({
    email:Joi.string().required().email().min(3).max(50),
    password:Joi.string().min(8).max(8).required()
  });


  exports.schema=schema;
  exports.users=users;
  
