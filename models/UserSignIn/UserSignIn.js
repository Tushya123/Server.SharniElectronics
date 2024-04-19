    const mongoose = require("mongoose");

const UserSignInSchema = new mongoose.Schema({
    firstName:{
        type:String,

    },lastName:{
        type:String,
        
    },
    email:{
        type:String,
        // unique:true,
    },
    password:{
        type:String,
    },
    mobile_no:{
        type:String,
        // unique:true
    },
    IsActive:{
        type:Boolean,
        default:true
    },
   
},
{timestamps:true}
);

module.exports = mongoose.model("UserSignIn",UserSignInSchema);