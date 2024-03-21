import mongoose from "mongoose";

const mp4Schema = new mongoose.Schema({
  filename: String,
  contentType: String,
  size: Number,
  uploadDate: Date,
  chunks: [mongoose.Schema.Types.ObjectId]
});

const MP4 = mongoose.model('MP4', mp4Schema);