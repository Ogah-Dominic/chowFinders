const express = require("express");
const router= express()
// const upload = require("../Utili/multer");
const {
  newrestaurant,
  restaurantVerify,
  signin,
  logout,
  getAll,
  getOne,
  forgotPassword,
  resetpassword,
  resendEmailVerification,
  updaterestaurant,
  deleterestaurant,
  addProfileImage,
  searchlocation,
  registerResturant
} = require("../controller/resturantController");

const { isAdmin, resturrantAuth } = require("../middlewares/authmiddleware");
const validateResturrant = require("../middlewares/validator")
// const router = express.Router();

router.route("/signup").post(registerResturant);
router.route("/verify/:token").put(validateResturrant, restaurantVerify);
router.route("/signin").post(validateResturrant, signin);
router.route("/logout").get(validateResturrant, resturrantAuth, logout);
router.route("/getall").get(resturrantAuth, getAll);
router.route("/getone/:resturrantAuthId").get(getOne);
router.route("/update-user/:userId").put(updaterestaurant);
router.route("/delete-user/:userId").delete(resturrantAuth, deleterestaurant);
router.route("/add-profile-image").put(validateResturrant, resturrantAuth,addProfileImage);
router.route("/forgot-password").get(validateResturrant, forgotPassword);
router.route("/resend-email-verification").get(validateResturrant, resendEmailVerification);
router.route("/reset-password/:token").put(validateResturrant, resetpassword);
// router.route("/searchlocation").get(searchlocation);



module.exports = router;