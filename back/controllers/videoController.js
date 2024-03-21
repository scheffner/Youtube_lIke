import User from "../models/User.js";
import Video from "../models/Video.js";
import Comment from "../models/Comment.js";
import fs from 'fs';
import multer from "multer";
// set up connection to db for file storage


export const getVideo =  async (req, res, next) => {
      try {
      const filename = req.params.filename;
      const range = req.headers.range;
      if(!range) {
         res.status(400, "The range header is needed !");
      }
      const videoPath = "./nfs-Server/Videos/"+filename+".mp4";
      const videoSize = fs.statSync(videoPath).size;
      
      const CHUNK_SIZE = 10 ** 6;
      const start = Number(range.replace(/\D/g, ""));
      const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
      const contentLength = end - start + 1;
   
      const headers = {
         "Content-Range": `bytes ${start}-${end}/${videoSize}`,
         "Accept-Ranges": "bytes",
         "Content-Length": contentLength,
         "Content-Type": "video/mp4"
      };
      res.writeHead(206, headers);
      const videoStream = fs.createReadStream(videoPath, { start, end });
      videoStream.pipe(res);
      } catch (err) {
        next(err);
      }
};

export const postVideo = async (req, res, next) => {
   try {
      const { title, description, thumbnailName, videoName, owner, videoSize } = req.body;

      const newVideo = new Video({
         title,
         description,
         thumbnailName,
         videoName,
         owner,
         videoSize
      });
      await newVideo.save();
   } catch (err) {
     next(err);
   }
 };

 export const getVideoOfUser = async(req,res, next) => {
   const { userId } = req.params;
   try {
      const videos = await Video.find({ owner: userId });

      const videoData = videos.map((video) => ({
         _id : video._id,
         videoName: video.videoName,
         thumbnail: video.thumbnailName,
         title: video.title,
         isBlocked: video.isBlocked,
         isHidden :video.isHidden
      }));

    res.json(videoData);
   } catch (err) {
      next(err);
    }
 }
 export const getMultipleVideos = async(req,res, next) => {
   try {
      const videos = await Video.find({ isBlocked: false, isHidden: false});
      const videoData = videos.map((video) => ({
         _id : video._id,
         videoName: video.videoName,
         thumbnail: video.thumbnailName,
         title: video.title,
         isBlocked: video.isBlocked,
         isHidden :video.isHidden
      }));
    res.json(videoData);
   } catch (err) {
      next(err);
    }
 }

 export const getVideoById = async(req,res, next) => {
   try {
      const video = await Video.findById(req.params.idVideo);
      res.status(200).json(video);
   } catch (err) {
      next(err);
   }
   };

 export const getThumbnailOfVideo = async(req, res, next) => {
   const { thumbnailName } = req.params;
   const imagePath = `C:/Users/Ilia/Desktop/SUPINFO/A3/3PROJ/final/main/back/nfs-Server/Thumbnails/${thumbnailName}`;
   

  res.sendFile(imagePath);
 }

 export const UpdateVideoBlocked = async (req, res, next) => {
   try {
      const updateVideo = await Video.findByIdAndUpdate(
         req.params.id,
         {
            $set : {
               isBlocked : req.body.isBlocked,
            }
         },
         { new: true }
      );
      res.status(200).json(updateVideo);
   } catch(err) {
      next(err);
   }
 }

 export const UpdateVideoHidden = async (req, res, next) => {
   try {
      const updateVideo = await Video.findByIdAndUpdate(
         req.params.id,
         {
            $set : {
               isHidden : req.body.isHidden,
            }
         },
         { new: true }
      );
      res.status(200).json(updateVideo);
   } catch(err) {
      next(err);
   }
 }

 export const AddViewToVid = async (req, res, next) => {
   try {
      const data = await Video.find({_id: req.params.id})
      const previousViews = data[0].views;
      const video = await Video.findByIdAndUpdate(
         req.params.id,
         {
            $set : {
               views : previousViews + 1,
            }
         },
         { new: true }
      );
      res.status(200).json(video);
   } catch(err) {
      next(err);
   }
 }