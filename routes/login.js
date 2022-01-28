const express = require('express')
const mongoose = require('mongoose');
const router=express.Router();
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const auth=require('../Models/auth')


const{users,schema}=require('../Models/users');




const us=mongoose.model('Users',users);




router.post('/log',async(request,respone)=>{
  

    const data = request.body;
    if (data.length === 0){
      return  respone.render('login',{error:'You must Fall Out The Email And Password'})
    }
  
    const valid=schema.validate(request.body);
    if(valid.error){
     
      return  respone.render('login',{error:valid.error.details[0].message})
    }

     let user=await us.findOne({email:request.body.email});
    
    if(!user){
      return  respone.render('login',{error:'Invalid email or password'})
      }

     
    const checkpass=await bcrypt.compare(request.body.password,user.password);
    const token=jwt.sign({_id:user._id},'/hgftrykhg{khfgv34t65')
     if(!checkpass){
    
    return  respone.render('login',{error:'Invalid email or password'})
     
      }

  if(token){
  
   respone.cookie("access_token", token, {
      httpOnly: true,
     
    }).redirect('/')

    
  }
    
   });


   
   router.get('/login', (req, res) => {
    res.render('login')
  })


  router.get("/logou",[auth], (req, res) => {
   return res
      .clearCookie("access_token")
      .redirect('back')
      .end()
});




   module.exports=router;