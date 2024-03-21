import User from "../models/User.js";
import Video from "../models/Video.js";
import Comment from "../models/Comment.js";


export const CheckAdmin = async (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    res.status(200).json({ message: 'Admin' });
  }else {
    res.status(403).json({ message: 'Not Admin' });
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password');
    const userMap = {};
    users.forEach(function(user) {
      userMap[user._id] = user;
    });
    res.status(200).json(userMap);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

export const getAllComments = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const comments = await Comment.find({ userId: userId }).select();
    const commentMap = {};
    comments.forEach(function (comment) {
      if (!commentMap.hasOwnProperty(comment.author)) {
        commentMap[comment.author] = [];
      }
      commentMap[comment.author].push(comment);
    });
    res.status(200).json(commentMap);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

export const getAllVideos = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const videos = await Video.find({ owner: userId }).select();
    const videosMap = {};
    videos.forEach(function (video) {
      if (!videosMap.hasOwnProperty(video.owner)) {
        videosMap[video.owner] = [];
      }
      videosMap[video.owner].push(video);
    });
    res.status(200).json(videosMap);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

export const blockVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.videoId);
    if (!video) {
      return res.status(404).json({ message: 'La vidéo n\'existe pas.' });
    }
    video.isBlocked = true;
    await video.save();
    res.status(200).json({ message: 'La vidéo a été bloquée.' });
  } catch (error) {
    next(error);
  }
};

export const disableVideoComments = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.videoId);
    if (!video) {
      return res.status(404).json({ message: 'La vidéo n\'existe pas.' });
    }
    video.commentsEnabled = false;
    await video.save();
    res.status(200).json({ message: 'Les commentaires de la vidéo ont été désactivés.' });
  } catch (error) {
    next(error);
  }
};

export const getUsersCount = async (req, res, next) => {
  try {
    const usersCount = await User.countDocuments();
    res.status(200).json({ usersCount });
  } catch (error) {
    next(error);
  }
};

export const getVideosCount = async (req, res, next) => {
  try {
    const videos = await Video.find({})
    const videosCount = await Video.countDocuments();
    var totalSize = 0;
    const videoMap = {};
    videos.forEach(function(video) {
      totalSize += video.videoSize
    });
    totalSize = totalSize / 1000000;
    res.status(200).json({ videosCount, totalSize });
  } catch (error) {
    next(error);
  }
};

export const getEvolutionStats = async (req, res, next) => {
  try {
    const usersByDay = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    const videosByWeek = await Video.aggregate([
      {
        $group: {
          _id: {
            year: { $isoWeekYear: "$createdAt" },
            week: { $isoWeek: "$createdAt" }
          },
          count: { $sum: 1 },
          totalSize: { $sum: "$size" }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    res.status(200).json({ usersByDay, videosByWeek });
  } catch (error) {
    next(error);
  }
};
