import express from 'express';
import { getVideo, postVideo , getVideoOfUser,getThumbnailOfVideo, UpdateVideoBlocked, UpdateVideoHidden, getVideoById, getMultipleVideos, AddViewToVid} from '../controllers/videoController.js';
import multer from 'multer';
import fs from "fs";
import { promisify } from 'util';
import { pipeline as pipelineCallback, PassThrough } from 'stream';

const router = express.Router();
const pipeline = promisify(pipelineCallback);
const upload = multer(); 

// Récupère une vidéo par son nom
router.get("/getSingleVideo/:filename", getVideo);
// Récupère une vidéo par son id
router.get("/getVideoById/:idVideo", getVideoById);
// Upload une vidéo
router.post("/uploadVideo", postVideo);
// Bloque une vidéo
router.put("/BlockStatus/:id", UpdateVideoBlocked);
// Cache une vidéo
router.put("/HiddenStatus/:id", UpdateVideoHidden);
// Récupère toutes le vidéos du user
router.get("/:userId", getVideoOfUser);
// Récupère vignette de la vidéo
router.get("/thumbnail/:thumbnailName", getThumbnailOfVideo);
// Récupère plusieurs vidéos au hasard
router.get("/", getMultipleVideos);
// Ajoute une vue à la vidéo
router.put("/Addview/:id", AddViewToVid);
// Upload le fichier de la vidéo
router.post("/uploadVideoFile", upload.single("vFile"), async function(req, res, next) {
    const {
        file, 
        body: { name }
    } = req;
    const filename = req.file.originalname;
    const readableStream = new PassThrough();
    readableStream.end(file.buffer);
    await pipeline(readableStream, fs.createWriteStream(`./nfs-Server/Videos/${filename}`));
    res.status(200).send(filename);
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

// Upload le fichier du thumbnail
router.post("/uploadThumbnailFile", upload.single("tFile"), async function(req, res, next) {
    const {
        file, 
        body: { name }
    } = req;
    const filename = req.file.originalname;
    const readableStream = new PassThrough();
    readableStream.end(file.buffer);
    await pipeline(readableStream, fs.createWriteStream(`./nfs-Server/Thumbnails/${filename}`));
    
}, (error, req, res, next) => {
     res.status(400).send({ error: error.message })
})




export default router;