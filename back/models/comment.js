import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  userId: {
    type: String
  },
  author: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
  },
  videoId: 
  {
    type: String,
    required: true
  }
});

export default mongoose.model("Comment", CommentSchema);