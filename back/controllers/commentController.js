import mongoose from "mongoose";
import Comment from "../models/Comment.js";
import User from "../models/User.js";

export const addComment = async (req, res) => {
  const { author, content, videoId } = req.body;
  try {
    const comment = new Comment({...req.body});
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getCommentsByVideoId = async (req, res) => {
  const { videoId } = req.params;
  try {
    const comments = await Comment.find({ videoId });
    const commentsData = await Promise.all(
      comments.map(async (comment) => {
        const user = await User.findOne({ name: comment.author });
        return {
          ...comment._doc,
          profilePicture: user ? user.profilePicture : null
        };
      })
    );
    res.json(commentsData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
export const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    const deletedComment = await Comment.findByIdAndDelete(commentId);
    if (!deletedComment) {
      return res.status(404).send('Comment not found');
    }
    res.status(200).json(deletedComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
