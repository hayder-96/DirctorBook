const bcrypt=require('bcrypt');
const Joi = require('joi');
const lod=require('lodash');
const jwt=require('jsonwebtoken');
const mongoose = require('mongoose');
const express = require('express')
const router=express.Router();
const crypto = require("crypto");
const passport = require('passport')

const {users,schema}=require('../Models/users');
const Token = require("../Models/token");


const us=mongoose.model('Users',users);

router.post('/reg',async (req,res)=>{

    const data = req.body;
    if (data.length === 0){
      return  res.render('register',{error:'Invalid email or password'})
    }
    
  
    const valid=schema.validate(req.body);
    if(valid.error){
      
      return  res.render('register',{error:valid.error.details[0].message})
    }

   
    let user=await us.findOne({email:req.body.email});

    

    if(user){
     
      return  res.render('register',{error:'Invalid email or password'})
  }
     user=new us(lod.pick(req.body,['email','password']));
    const saltRounds=10;
    const salt=await bcrypt.genSalt(saltRounds);
    user.password=await bcrypt.hash(user.password,salt);
    const token=jwt.sign({_id:user._id},'/hgftrykhg{khfgv34t65')

    
    if(token){
        await user.save();
        res.cookie("access_token",token, {
          httpOnly: true,
         
        }).redirect('/')
        
   
       }
     
          })

          router.get('/reg', (req, res) => {
            res.render('register')
          })


          router.get('/google', async (req, res) => {
            res.render('gog')
          })


          router.get('/forgot', async (req, res) => {
            res.render('forgotpassword')
          })
       
  

      
        

      
        var userProfile;


        passport.serializeUser(function(user, cb) {
          cb(null, user);
        });
        
        passport.deserializeUser(function(obj, cb) {
          cb(null, obj);
        });



        const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
        const GOOGLE_CLIENT_ID = 'xxxxxxxxxxxxxxxxxx';
        const GOOGLE_CLIENT_SECRET = 'xxxxxxxxxxxxxxx';
        passport.use(new GoogleStrategy({
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/google/callback"
          },
          function(accessToken, refreshToken, profile, done) {
            userProfile=profile;

            return done(null, userProfile);
          }
        ));



        router.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));
 
router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    
    res.redirect('/success');
  });


  




  router.get('/success', async(req,res)=>{
    if (!userProfile){
      return  res.render('register',{error:'Faild'})
    }
  
    let user=await us.findOne({email:userProfile.emails[0].value});
  
    if(user){
                 
      const tok=jwt.sign({_id:user._id},'/hgftrykhg{khfgv34t65')
     
    return  res.cookie("access_token", tok, {
        httpOnly: true,
       
      }).redirect('/')
       
     
  }
  
  
  user=new us({email:userProfile.email,password:userProfile.id});
  const saltRounds=10;
  const salt=await bcrypt.genSalt(saltRounds);
  user.password=await bcrypt.hash(user.password,salt);
  const tok=jwt.sign({_id:user._id},'/hgftrykhg{khfgv34t65')
  
  
  if(tok){
      await user.save();
      res.cookie("access_token", tok, {
        httpOnly: true,
       
      }).redirect('/')
  
     }
  
  })
  
  
  

  







  router.post("/forgot", async (req, res) => {
    try {
        const schema = Joi.object({ email: Joi.string().email().required() });
        const { error } = schema.validate(req.body);
        if (error)  return  res.render('forgotpassword',{error:'Invalid email or password'})

        const user = await us.findOne({ email: req.body.email });
        if (!user)
      return  res.render('forgotpassword',{error:'Invalid email or password'})

        let token = await Token.findOne({ userId: user._id });
        if (!token) {
            token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex"),
            }).save();
        }

        const link = `http://localhost:3000/${user._id}/${token.token}`;
        await sendEmail(user.email,link);
        res.render('forgotpassword',{error:'We Send Link On Your Gemail'})

     
    } catch (error) {
      res.render('forgotpassword',{error:'Invalid email or password'})
        
    }
});


















router.get("/:userId/:token", async (req, res) => {

  try {   
      const token = await Token.findOne({
          userId: req.params.userId,
          token: req.params.token,
      });
      if (!token) return res.status(400).send("Invalid link or expired");
      
    
      

      res.render('newPassword',{
        token:token
      });
  } catch (error) {
      res.send("An error occured");
      console.log(error);
  }
});














router.post("/newpassword/:token", async (req, res) => {
  try {
    

    const token = await Token.findOne({
       token: req.params.token,
  
   });

  

  if (!token) return res.render('newPassword',{error:'Invalid link or expired'})
let user=await us.findOne({_id:token.userId});

  if(!user){
    return  res.render('newPassword',{error:'Invalid email or password'})
  }

  

  const saltRounds=10;
  const salt=await bcrypt.genSalt(saltRounds);
  user.password=await bcrypt.hash(req.body.password,salt);
  const tok=jwt.sign({_id:user._id},'/hgftrykhg{khfgv34t65')
  
  
  if(tok){
      await user.save();
      res.cookie("access_token", tok, {
        httpOnly: true,
       
      }).redirect('/')
  
      token.remove();
     }
   
  } catch (error) {
      res.send("An error occured");
      console.log(error);
  }

});








function sendEmail(email,uri){

  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey('xxxxxxxxxxxxxxxx');
  
  
  const msg = {
    to: email,
    from: 'hxhwe1924@gmail.com', // Use the email address or domain you verified above
    subject: `Hello`,
    
    html : `Hello,<br> Please Click on the link to verify your email.<br><a href="${uri}">Click here to verify</a>`
   
  };
  
  
  
  sgMail
    .send(msg)
    .then(() => {}, error => {
      console.error(error);
  
      if (error.response) {
        console.error(error.response.body)
      }else{
        console.error('success')
      }
    });
  //ES8
  (async () => {
    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error(error);
  
      if (error.response) {
        console.error(error.response.body)
      }else{
        console.error('success')
      }
    }
  })();
  }














            module.exports=router;