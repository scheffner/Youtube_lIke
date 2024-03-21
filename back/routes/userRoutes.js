import express from "express";
import {
  signup,
  login,
  getUser,
  verifyAccount,
  updateProfile,
  deleteAccount,
  logout,
  getProfilePictureOfUser,
  deletePP, 
  resetPassword
} from "../controllers/userController.js";
import { Authentication } from "../Authentication.js";
import { promisify } from 'util';
import fs from "fs";
import { pipeline as pipelineCallback, PassThrough } from 'stream';
import multer from "multer";

const router = express.Router();
const upload = multer(); 
const pipeline = promisify(pipelineCallback);

// Permet à un utilisateur de s'inscrire
router.post("/signup", signup);
// Permet à un utilisateur de se connecter 
router.post("/login", login);
// Permet de verifier le compte de l'utilisateur connecter
router.get("/verify-account", /*Authentication,*/ verifyAccount);
// Permet de recuperer les information d'un utilisateur avec son Id
router.get("/getUser/:id", getUser);
// Permet de mettre à jour les informations d'un utilisateur
router.put("/updateProfile/:id", Authentication, updateProfile);
// Permet de supprimeer le compte d'un utilisateur 
router.delete("/deleteAccount/:id", Authentication, deleteAccount);
// Permet à un utilisateur de se deconnecter 
router.get("/logout", Authentication, logout);
// Permet de récupérer l'image de profil d'un user
router.get("/getProfilepicture/:profilePicture", getProfilePictureOfUser);
// Permet de supprimer l'image de profil d'un user
router.post("/deletePreviousPP/:text", deletePP);
//Pour reset le mot de passe
router.post('/resetpassword', resetPassword);
//Pour upload une PP 
router.post("/uploadProfilePicture", upload.single("profilePic"), async function(req, res, next) {
  const {
      file, 
      body: { name }
  } = req;
  const filename = req.file.originalname;
  const readableStream = new PassThrough();
  readableStream.end(file.buffer);
  await pipeline(readableStream, fs.createWriteStream(`./nfs-Server/ProfilePictures/${filename}`));
  
}, (error, req, res, next) => {
   res.status(400).send({ error: error.message })
})

export default router;
