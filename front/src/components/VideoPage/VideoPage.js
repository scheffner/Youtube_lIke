import React, { useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
import VideoPageCss from "./VideoPage.module.css";
import Avatar from "../../assets/img_avatar.png";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { CheckUser } from "../ApiSec/ApiSec";



const VideoPage = () => {
    const { filename, videoId } = useParams();
    const userId = Cookies.get('_id');
    const author = Cookies.get('userName');
    const role = Cookies.get('role');
    const [videoData, setVideoData] = useState([]);
    const url = "http://localhost:4000/videos/getSingleVideo/"+filename
    const [content, setContent] = useState("");
    const [comments, setComments] = useState([]);
    const [added, setAdded] = useState(false);
    const [date,setDate] = useState("");
    CheckUser();

    const fetchVideoData = async () => {
       fetch("http://localhost:4000/videos/getVideoById/"+videoId)
       .then(response => {
        return response.json()
        })
        .then(data => {
            setDate(data.createdAt.slice(0,10))
            setVideoData(data)
        })
        axios.put("http://localhost:4000/videos/Addview/"+videoId)
    }

    const fetchVideoComments = async () => {
        const response = await fetch(`http://localhost:4000/comments/videos/${videoId}`);
        const commentData = await response.json();
        const commentDataWithPP = await Promise.all(
            commentData.map(async(comment) => {
                const pPResponse = await fetch(
                    `http://localhost:4000/users/getProfilepicture/${comment.profilePicture}`
                );
                const blob = await pPResponse.blob();
                const pPUrl = URL.createObjectURL(blob);
                
                return {
                    ...comment,
                    pPUrl,
                };
            })
        );

        setComments(commentDataWithPP)
    }

    const postComment = async () => {
        await axios.post("http://localhost:4000/comments/addcomment",
            JSON.stringify({ userId ,author, content, videoId }),
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
        setContent("");
        setAdded(true);
    }

    const deleteComment = async (commentId) => {
        await axios.delete("http://localhost:4000/comments/"+commentId);
        setAdded(true);
    }
    
    useEffect(() => {
        fetchVideoData();
        fetchVideoComments();
    }, [])

    useEffect(() => {
        if (added === true) {
            fetchVideoComments();
            setAdded(false);
        }
    }, [added]);
    
    return (
        <>
        <header>
          <NavBar></NavBar>
        </header>
        <body className={VideoPageCss.MainContainer}>
            <div className={VideoPageCss.Primary}>
                <div className={VideoPageCss.VideoContainer}>
                <ReactPlayer className={VideoPageCss.video} width="100%" height="100%" controls={true} url={url} type='video/mp4'/>
                </div>
            <div>
            </div>
                <div className={VideoPageCss.Title}>
                    <h2>{videoData.title}</h2>
                </div>
                <div className={VideoPageCss.VideoInfo}>
                    <div className={VideoPageCss.VideoLinks}>
                        <div className={VideoPageCss.UserInfo}>
                            <img className={VideoPageCss.userimg}  src={Avatar} alt="Avatar"/>
                            <p>{author}</p>
                        </div>
                    </div>
                </div>
                <div className={VideoPageCss.Description}>
                    <p>Uploaded on the {date} {videoData.views} views</p>
                    <p>{videoData.description}</p>
                </div>
                <div className={VideoPageCss.Comments}>
                    <div className={VideoPageCss.AddComment}>
                        <input placeholder="Add a comment" value={content} onChange={(e) => setContent(e.target.value)}/>
                        {content.length !== 0 ?
                            <button onClick={postComment}>Add comment</button>
                            :
                            <p></p>
                        }
                    </div>
                    <div className={VideoPageCss.CommentsList}>
                        {comments.map((singleComment)=> (
                            <div className={VideoPageCss.CommentContainer}>
                                <img src={singleComment.pPUrl}></img>
                                <div className={VideoPageCss.CommentText}>
                                    <h4>{singleComment.author}</h4>
                                    <p>{singleComment.content}</p>
                                    {(role === "admin" || singleComment.author === author) && (
                                        <button onClick={() => deleteComment(singleComment._id)}>
                                            🗑️
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </body>
        </>
    )

}

export default VideoPage;