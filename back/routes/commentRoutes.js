import express from "express";
import {
    addComment,
    getCommentsByVideoId,
    deleteComment,
} from "../controllers/commentController.js";
import { Authentication, isLoggedIn } from "../Authentication.js";

const router = express.Router();

// Route pour ajouter un commentaire
router.post('/addcomment', addComment);
// Route pour afficher tous les commentaires d'une vidéo
router.get('/videos/:videoId', getCommentsByVideoId);
// Route pour supprimer un commentaire
router.delete('/:commentId', deleteComment);

export default router;