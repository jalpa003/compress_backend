const jwt = require('jsonwebtoken');
const{JWT_TOKEN} = require('./../../keys');
const mongoose = require('mongoose');
const usermodel =  require('../models/user_model');

module.exports = (req,res,next)=>{
    const {authorization} = req.headers;

    if(!authorization){
        return res.json({success: false,error: "you are not logged in"});
    }

    const token = authorization.replace("Bearer ","");

    jwt.verify(token,JWT_TOKEN,(err,payload)=>{
        if(err){
            return res.json({success:false,error: "you are not logged in"});
        }
        const{_id} = payload;
        usermodel.findById(_id).then(userdata=>{
            req.user = userdata;
            next();
        });
       
    })

}