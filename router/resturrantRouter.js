const express = require("express");
const upload = require("../Utili/multer");
const {
  newResturrant,
  ResturrantVerify,
  signin,
  logout,
  getAll,
  forgotPassword,
  resetpassword,
  resendEmailVerification,
  updateResturrant,
  deleteResturrant,
  addProfileImage,
} = require("../controller/resturantController");

const { isAdmin, userAuth } = require("../middlewares/authmiddleware");
const router = express.Router();

router.post("/signup", newResturrant);

router.put("/verify/:token", ResturrantVerify);
router.post("/signin", signin);
router.get("/logout", userAuth, logout);
router.get("/getall", userAuth, getAll);
router.put("/update-user/:userId", userAuth, updateResturrant);
router.delete("/delete-user/:userId", userAuth, deleteResturrant);
router.put("/add-profile-image",userAuth,upload.single("profilePicture"),addProfileImage);
router.get("/forgot-password", forgotPassword);
router.get("/resend-email-verification", resendEmailVerification);
router.put("/reset-password/:token", resetpassword);
module.exports = router;