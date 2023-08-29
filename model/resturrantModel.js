const mongoose = require("mongoose")
const restaurantSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: [true, "business name is required"]
  },
  address: {
    type: String,
    required: [true, "address is required"]
  },
  // location: {
  //   type: String,
  //   required: true
  // },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: false
  },
  profileImage: {
    type: String,
    require: [true, "profileImage is required"]
  },
  phoneNumber: {
    type: String,
    require: [true, "phoneNumber is required"],
  },
  menus: [{
    type: mongoose.Types.ObjectId,
    ref: "Menu",
  }],
  password: {
    type: String,
    require: [true, "password is required"]
  },
  confirmPassword: {
    type: String,
    require: [true, "confirmPassword is required"]
  },
  isloggedin: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  role:{
    type:String,
    enum:["superAdmin","admin"],
    default:"admin"
  }

}, { timestamps: true });
const restaurantModel = mongoose.model("Restaurant", restaurantSchema)
module.exports = restaurantModel