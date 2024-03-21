import { Int32 } from "mongodb";
import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true
    },
    thumbnailName: {
      type: String,
      required: true
    },
    videoName: {
      type: String,
      required: true
    },
    owner: {
      type: String,
      required: true
    },
    videoSize: {
      type: Number,
      required: true
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    isHidden: {
      type: Boolean,
      default: false
    },
    isBlocked: {
      type: Boolean,
      default: false
    },
    views: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

VideoSchema.methods.incrementViews = async function() {
  this.views += 1;
  await this.save();
};

export default mongoose.model("Video", VideoSchema);