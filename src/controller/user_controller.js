const bcrypt = require('bcrypt');
const UserModel = require('../models/user_model');
const { response } = require('express');
const docxpdf = require('docx-pdf');
const fs = require("fs");
const path = require("path");
const jwt = require('jsonwebtoken');
const{JWT_TOKEN} = require('./../../keys');

const userController = {

    signup : async function(req,res){
    
      try {
        const userData = req.body;
        const email = req.body.email;
        console.log(email);
        const founduser = await UserModel.findOne({email:email});
        if(founduser) {
          
       return res.json({success:false, error: "Email already registered"});
        
       }
      const password = userData.password;
      const salt = await bcrypt.genSalt(10);
      const hashpassword = await bcrypt.hash(password, salt);
      userData.password = hashpassword;
      const newUser = new UserModel(userData);
       await newUser.save();
       return res.json({success:true,message:"User Registered Successfully"});
      }catch(err){
        console.log(err);
        return res.json({success:false,error:err});
      }
    },

    login: async function(req,res){
        try{
          const email = req.body.email;
          const password = req.body.password;
          const founduser = await UserModel.findOne({email:email});
        if(!founduser) {
          console.log(email);
        res.json({success:false, error: "No user found"});
        return;
       }
       const correctPassword = await bcrypt.compare(password,founduser.password);
        if(!correctPassword){
        res.json({success:false, error: "Incorrect password"});
        return;
       }
 
      const token = jwt.sign({_id:founduser._id},JWT_TOKEN);
 
      return  res.json({success : true, token: token,data: founduser})
 
          
        }catch(e){
          console.log(e);
        return  res.json({success:false, error: "Something went wrong"});
        }
    },

    changepassword: async function(req,res){

      try{
        const userdata = req.body;
        const oldpassword = userdata.oldpassword;
        const finduser =await UserModel.findById(req.user._id);
        if(!finduser){
          return res.json({success:false,message:"User not found"});
        }
        const passwordMatch = await bcrypt.compare(oldpassword, finduser.password);
        console.log(passwordMatch);
        if (!passwordMatch) {
          return res.json({success:false, message: 'Invalid old password' });
        }
         
        const salt = await bcrypt.genSalt(10);
      const hashpassword = await bcrypt.hash(userdata.newpassword, salt);
       finduser.password = hashpassword;
       await finduser.save();
       return res.json({success:true,message:"Password Change Successfully"});
     
      }catch(e){
        console.log(e);
        return res.json({success:false,message:"something went wrong",error:e});
      }
    },


    doctodpf : async function(req,res){
     
        try{
            const filename = req.file.originalname;
            const name =  filename.split("/").slice(-1).join().split(".").shift() + ".pdf";
            
           docxpdf(req.file.path,"uploads/" + name,function(err,result){
            if(err){
                console.log(err);
                return res.json({success:false,err:err,message:"Something went wrong"});
            }
            else{
                console.log('result'+result);
                //change acc to server
                const filePath = "uploads/" + name;
                const now = new Date();

                // to remove the server upload files to save space
                if (fs.existsSync(req.file.path)) {
                    // Delete the file
                    fs.unlinkSync(req.file.path);
                  }
                setTimeout(() => {
                    // Check if the file still exists
                    if (fs.existsSync(filePath)) {
                      // Delete the file
                      fs.unlinkSync(filePath);
                    }
                  }, 600000);

                  return res.json({success:true,convertedpdf:name})
            }
           })


        }catch(err){
            console.log(err);
            return res.json({success:false,message:"Something went wrong", err:err})
        }
    

    },
    


}




module.exports = userController;