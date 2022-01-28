


module.exports=function(req,res,next){

    const token=req.cookies.access_token;
    if(!token){
       return res.redirect('/reg')
    }
    try{
      
        next()
    }catch(e){
        return res.status(400).send('wrong send');
    }
}