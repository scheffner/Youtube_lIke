import express from "express";
import {
    getAllUsers,
    getAllComments,
    blockVideo,
    disableVideoComments,
    getUsersCount,
    getVideosCount,
    getEvolutionStats,
    getAllVideos,
    CheckAdmin,
} from "../controllers/adminController.js"

import { Authentication } from "../Authentication.js";
import { isAdmin } from "../Authorization.js";

const router = express.Router();

//Permet de vérifier le role de l'utilisateur
router.get("/checkRole", CheckAdmin);
//Permet de récupérer tout les utilisateurs 
router.get('/allUsers', Authentication, isAdmin, getAllUsers);
//Permet de récupérer tout les 
router.get('/getAllComments/:userId', Authentication, isAdmin, getAllComments);
// Permet de réupérer toutes les vidéos d'un utilisateur
router.get('/getAllVideos/:userId', Authentication, isAdmin, getAllVideos);
// Permet de bloquer une vidéo
router.put('/videos/:videoId/block', Authentication, isAdmin, blockVideo);
// Permet de désactiver les commentaires d'une vidéo
router.put('/videos/:videoId/disable-comments', Authentication, isAdmin, disableVideoComments);
// Permet de récupérer le nombre d'utilisateurs enregistrés
router.get('/stats/users', Authentication, isAdmin, getUsersCount);
// Permet de récupérer le nombre de vidéos Uploader
router.get('/stats/videos', Authentication, isAdmin, getVideosCount);
// Permet de récupérer les statistiques sur l'évolution des utilisateurs et des vidéos
router.get('/stats/evolution', Authentication, isAdmin, getEvolutionStats);

export default router;
