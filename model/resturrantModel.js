const mongoose = require("mongoose")
const resturrantSchema = new mongoose.Schema({
    businessName:{
        type: String,
        require: true
    },
    adress:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true,
        unique: true
    },
    profileImage:{
        type: String,
        require: true,
    },
    menu:{
              type: mongoose.Types.ObjectId,
            ref: "Menu",
            default: null
    },
    password:{
        type: String,
        require: true,
       
    },
    confirmPassword:{
        type: String,
        require: true,
        
    }

});
const resturrantModel = mongoose.model("Resturrant", resturrantSchema)
module.exports = resturrantModel