const bcrypt = require('bcrypt');
const UserModel = require('../models/user_model');
const { response } = require('express');
const docxpdf = require('docx-pdf');
const lame = require('lamejs');


const fs = require("fs");
const path = require("path");
const userController = {

    signup : async function(req,res){
    
      try {
        const userData = req.body;

    const password = userData.password;
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);
    userData.password = hashpassword;
    const newUser = new UserModel(userData);
     await newUser.save();
      return res.json({success:true,message:"User Registered Successfully"});
      }catch(err){
        return res.json({success:false,error:err});
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
    
    audiocompress: async function(req,res){
      const mp3encoder = new lamejs.Mp3Encoder(1, SAMPLE_RATE, KBPS);
      let samples = audioBuffer.getChannelData(0).map(x => x * 32767.5);
      const encoded = mp3encoder.encodeBuffer(samples);
      mp3Data.push(encoded);
      mp3Data.push(mp3encoder.flush());

}



}




module.exports = userController;