const Resturrant = require('../model/resturrantModel')
const cloudinary = require("../Utili/cloudinary")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")

const { sendEmail } = require("../middlewares/sendEmail");
const { genToken, decodeToken } = require("../Utili/jwt");
const fs = require("fs");

exports.newResturrant = async (req, res) => {
    try {
        console.log(req.body)
        console.log(req.files)
      const { 
        businessName,
        address, 
        email, 
        menu, 
        phoneNumber, 
        password,
        confirmPassword} = req.body;

      const isEmail = await Resturrant.findOne({ email });
      if (password === confirmPassword) {
        if (isEmail) {
          res.status(400).json({
            message: "email already registerd",
          });
        } else {
          const salt = bcryptjs.genSaltSync(10);
          const hash = bcryptjs.hashSync(password, salt);
         const image =await cloudinary.uploader.upload(req.files.profileImage.tempFilePath)
          const resturrant = await Resturrant.create({
        businessName,
        address, 
        email: email.toLowerCase(), 
        menu, 
        phoneNumber, 
        password:hash,
        confirmPassword: hash,
        profileImage: image.secure_url
          });
          const token = await genToken(resturrant._id, "1d");
          console.log(token)
          const subject = "New Resturrant";
          const link = `${req.protocol}://${req.get("host")}//verify/${token}`;
          const message = `welcome onboard Resturrant kindly use this ${link} to verify your account`;
          const data = {
            email: email,
            subject,
            message,
          };
          sendEmail(data);
          res.status(200).json({
            success: true,
            data: resturrant,
          });
        }
      } else {
        res.status(400).json({
          message: "Your password and Confirm password must match",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

  exports.ResturrantVerify = async (req, res) => {
    try {
      const { token } = req.params;
      console.log(token);
      //console.log(id);
      const ResturrantInfo = await decodeToken(token);
      console.log(ResturrantInfo);
      //const tokens = await jwt.verify(token, process.env.JWT_SECRET);
      if (ResturrantInfo) {
        await Resturrant.findByIdAndUpdate(ResturrantInfo._id, { isVerified: true });
        res.status(200).json({ message: "Resturrant verified" });
      } else {
        throw new Error("error verifying Resturrant, please try again");
      }
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
  
  exports.resendEmailVerification = async (req, res) => {
    try {
      const { email } = req.body;
      const resturrant = await Resturrant.findOne({ email });
      if (resturrant && !resturrant.isVerified) {
        const token = await genToken(resturrant._id, "1d");
        const subject = "New Resturrant";
        const link = `${req.protocol}://${req.get("host")}//verify/${token}`;
        const message = `welcome! kindly use this ${link} to verify your account`;
        const data = {
          email: email,
          subject,
          message,
        };
        sendEmail(data);
        res.status(200).json({
          message: "verificaton email sent",
        });
      } else if (resturrant?.isVerified) {
        res.status(200).json({
          message: "Resturrant already verified",
        });
      } else {
        res.status(404).json({
          message: `Resturrant with this ${email} not found`
        });
      }
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

// SIGNIN
  exports.signin = async (req, res) => {
    try {
      const { email, password } = req.body;
      const resturrant = await Resturrant.findOne({ email });
      //console.log(user);
      let checkPassword = false;
      if (resturrant) {
        checkPassword = bcryptjs.compareSync(password, resturrant.password);
      }
      if (!resturrant || !checkPassword) {
        res.status(400).json({
          message: "invalid credentials",
        });
      } else if (resturrant.isBlocked) {
        res.status(200).json({
            message: "This Resturrant is blocked"
         });
      } else if (!resturrant.isVerified) {
        const token = await genToken(resturrant._id, "20m");
        const subject = "verify now";
        const link = `${req.protocol}://${req.get("host")}/trippy/verify/${token}`;
        const message = ` kindly use this ${link} to verify your account`;
        const data = {
          email: email,
          subject,
          message,
        };
        sendEmail(data);
        res.status(401).json({
          message: "you are not verified check your email to verify",
        });
      } else {
        resturrant.isloggedin = true;
        const token = await genToken(user._id, "1d");
        await resturrant.save();
  
        res.status(200).json({
             token, resturrant
             });
      }
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

  exports.forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      //create a link with the reset password link and send it to email
      const resturrant = await Resturrant.findOne({ email });
      if (resturrant) {
        const subject = "forgotten password";
        const token = await genToken(resturrant._id, "20m");
        // for better security practice a unique token should be sent to reset password instead of user._id
        const link = `${req.protocol}://${req.get("host")}/trippy/reset-password/${token}`;
        const message = `click the ${link} to reset your password`;
        const data = {
          email: email,
          subject,
          message,
        };
        sendEmail(data);
        res.status(200).json({
          message: "Check your registered email for your password reset link",
        });
      } else {
        res.status(404).json({
          message: "Resturrant not found",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
  
  exports.resetpassword = async (req, res) => {
    try {
      const { token } = req.params;
      const { newpassword } = req.body;
      const salt = bcryptjs.genSaltSync(10);
      const hashedPassword = bcryptjs.hashSync(newpassword, salt);
      const resturrantInfo = await decodeToken(token);
      const resturrant = await Resturrant.findByIdAndUpdate(resturrantInfo._id, {password: hashedPassword,});
      if (resturrant) {
        res.status(200).json({
          message: "password successfully reset",
        });
      } else {
        res.status(500).json({
          message: "error changing password",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
  
  exports.logout = async (req, res) => {
    try {
      const resturrant = await Resturrant.findById(req.resturrant._id);
      const blacklist = [];
      const hasAuthorization = req.headers.authorization;
      const token = hasAuthorization.split(" ")[1];
      blacklist.push(token);
      user.isloggedin = false;
      await resturrant.save();
      res.status(200).json({ 
        message: "logged out successfully" 
    });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
  
  exports.getAll = async (req, res) => {
    try {
      const resturrant = await Resturrant.find();
      if(resturrant){
        res.status(200).json({
            resturrant
        });
      }
    //   res.json({ users });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
  
  exports.getOne = async (req, res) => {
    try {
      const { resturrantId } = req.params;
      const resturrant = await Resturrant.findById(resturrantId);
      if(resturrant){
        res.status(200).json({
            resturrant
        })
      }
    //   res.json({ user });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
  
  exports.updateResturrant = async (req, res) => {
    try {
      const { resturrantId } = req.params;
      const { 
        BusinessName, email,menu, address } = req.body;
      const resturrant = await Resturrant.findById(resturrantId);
      //console.log(req.user._id.toString());
     // console.log(user.id);
      if (!resturrant) {
        res.status(404).json({ message: "no resturrant found" });
      } else  {
        const updatedUser = await Resturrant.findByIdAndUpdate(
            resturrantId,
          { BusinessName, email, menu, address },
          { new: true }
        );
  
        res.status(200).json({ message: "Resturrant updated", updatedUser });
      } 
      //else {
    //     res
    //       .status(401)
    //       .json({ messgae: "you are not authorized to update this user" });
    //   }
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
  
  //add profile picture
  // update profile
  exports.addProfileImage = async (req, res) => {
    const { resturrantId } = req.body;
    try {
      const profile = await Resturrant.findById(resturrantId);
      if (profile) {
        console.log(req.file);
        let result = null;
        // Delete the existing image from local upload folder and Cloudinary
        if (req.file) {
          if (profile.profileImage) {
            const publicId = profile.profileImage
              .split("/")
              .pop()
              .split(".")[0];
            console.log(publicId);
            await cloudinary.uploader.destroy(publicId);
          }
          result = await cloudinary.uploader.upload(req.file.path);
          // Delete file from local upload folder
          fs.unlinkSync(req.file.path);
          profile.set({
            profileImage: result.secure_url,
          });
          await profile.save();
  
          const updated = await Resturrant.findById(userId);
  
          res.json({ message: "profile updated successfully",
          data: updated });
        } else {
          res.status(400).json({ 
            message: "no profile picture added" 
        });
        }
      } else {
        res.status(404).json({
             message: "profile not found" 
            });
      }
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
  
  //Delete
  
  exports.deleteResturrant = async (req, res) => {
    try {
      const { resturrantId } = req.params;
  
      const resturrant = await Resturrant.findById(resturrantId);
      console.log(req.resturrant._id.toString());
      console.log(resturrant.id);
      if (!resturrant) {
        res.status(404).json({ message: "no resturrant found" });
      } else if (req.resturrant._id.toString() == resturrantId || req.resturrant.isAdmin) {
        const deletedresturrant = await Resturrant.findByIdAndDelete(resturrantId);
        res.status(200).json({ message: "resturrant deleted", deletedresturrant });
      } else {
        res
          .status(401)
          .json({ messgae: "you are not authorized to delete this resturrant" });
      }
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
  
  



  
  
