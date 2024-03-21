import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import Grid from "gridfs-stream";
import fs from 'fs';
import path from "path";
import multer from "multer";


const app = express();
dotenv.config();

const conn = mongoose.createConnection(process.env.MONGO_URI);

const connect = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connected to DB");

      const conn = mongoose.connection;
      const gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'mp4s'
      });
      app.set('gfs', gfs);
    })
    .catch((err) => {
      throw err;
    });
};

app.use(cors({
  credentials:true,
  origin: 'http://localhost:3000'}));

app.use(cookieParser());
app.use(express.json());

app.use("/users", userRoutes);
app.use("/admin", adminRoutes);
//app.use("/liveChat", liveChatRoutes);
app.use("/videos", videoRoutes);
app.use("/comments", commentRoutes);


app.listen(4000, () => {
  connect();
  console.log("Connected to Server");
});