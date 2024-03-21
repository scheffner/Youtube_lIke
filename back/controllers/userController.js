import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../Error.js";
import jwt from "jsonwebtoken";
import fs from "fs";

//here an user can create a new account
export const signup = async (req, res, next) => {

  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({...req.body, password: hash });

    await newUser.save();
    res.status(200).send ("A new user was created");
  } catch (err) {
    next(err);
  }
};
//get an existing user account
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

//here an user can login with his nmae and his password
export const login = async (req, res, next) => {
    try {
      const user = await User.findOne({ name: req.body.name });
      if (!user) return next(createError(404, "User not found!"));
  
      const isCorrect = await bcrypt.compare(req.body.password, user.password);
  
      if (!isCorrect) return next(createError(400, "Wrong Credentials!"));
      
      const token = jwt.sign({ id: user._id, role: user.role}, process.env.JWT);
      const { password, ...others } = user._doc;
  
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(others);
    } catch (err) {
      next(err);
    }
};
// Verify user's account using token sent via email
export const verifyAccount = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    const decoded = jwt.verify(token, process.env.JWT);
    const userId = decoded.id;
    
    // Find the user in the database and update their isVerified status
    const user = await User.findById(userId);
    if (!user) return next(createError(404, "User not found!"));

    // Send a response to the client
    res.status(200).send("Your account has been verified successfully!");
  } catch (err) {
    next(err);
  }
};

// function to log the user out by clearing the access token cookie
export const logout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).send("Logged out successfully");
  } catch (err) {
    next(err);
  }
};

// function to update the user's profile information
export const updateProfile = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set : {
            name : req.body.name,
            email : req.body.email,
            profilePicture: req.body.profilePicture
          }
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  } else {
    return next(createError(403, "You can update only your account!"));
  }
};

// function to delete the user's account
export const deleteAccount = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted.");
    } catch (err) {
      next(err);
    }
  } else {
    return next(createError(403, "You can delete only your account!"));
  }
};

export const getProfilePictureOfUser = async(req, res, next) => {
  const { profilePicture } = req.params;
  const imagePath = `C:/Users/Ilia/Desktop/SUPINFO/A3/3PROJ/final/main/back/nfs-Server/ProfilePictures/${profilePicture}`;
  
 res.sendFile(imagePath);
}

export const deletePP = async(req) => {
  const { text } = req.params;
  if (text != "default") {
    fs.unlinkSync(`./nfs-Server/ProfilePictures/${text}`);
  }
}

// Function to handle password reset for a user
export const resetPassword = async (req, res, next) => {
  try {
    const { userName, newPassword } = req.body;

    // Find the user by email
    const user = await User.findOne({ name: userName });
    if (!user) {
      return next(createError(404, "User not found!"));
    }

    // Generate a new password hash
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newPassword, salt);

    // Update the user's password in the database
    user.password = hash;
    await user.save();

    // Send a response to the client
    res.status(200).send("Password reset successful!");
  } catch (err) {
    next(err);
  }
};