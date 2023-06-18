const{Schema,model} = require('mongoose');


const userSchema = new Schema({
    fullname:{type:String,required:true},
    email:{type:String,required:true},
    password : {type:String,required:true}
});

const userModel = model("user", userSchema);

module.exports = userModel;