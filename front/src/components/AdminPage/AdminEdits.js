import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminCenterCss from "./AdminCenter.module.css"
import { CheckUser } from "../ApiSec/ApiSec";

const AdminEdits = () => {

    let parameter = useParams();
    const [user, setUser] = useState([]);
    const [comments, setComments] = useState([]);
    const [videos, setVideos] = useState([]);
    const [changed, setChanged ] = useState(false);
    const [button1Disabled, setButton1Disabled] = useState(true);
    const [button2Disabled, setButton2Disabled] = useState(false);
    CheckUser();

    const getUserInfo = () => {
        fetch("http://localhost:4000/users/getUser/"+ parameter._id)
        .then(response => {
            return response.json()
        })
        .then(data => {
            setUser(data)
        })
    }

    const getComments = async () => {
        fetch("http://localhost:4000/admin/getAllComments/" + parameter._id, {
          credentials: 'include'
        })
          .then(response => {
            return response.json()
          })
          .then(data => {
            const userCommentsKey = Object.keys(data)[0];
            const userComments = data[userCommentsKey];
            setComments(userComments);
          });
      };

    const getVideosData = async () => {
        fetch("http://localhost:4000/admin/getAllVideos/" + parameter._id, {
          credentials: 'include'
        })
          .then(response => {
            return response.json()
          })
          .then(data => {
            const userVideosKey = Object.keys(data)[0];
            const userVideos = data[userVideosKey];
            setVideos(userVideos);
          });
    }

    const UpdateBlockStatus= (status) => {
        const pos = status.indexOf("/");
        const bool = status.substr(0, pos);
        const _id = status.substr(pos+1)
        axios.put("http://localhost:4000/videos/BlockStatus/"+_id, {
          isBlocked: bool
        })
        setChanged(true);
      }

    const DeleteComment = (status) => {
        axios.delete("http://localhost:4000/admin/deleteComment/"+status, {
            withCredentials: true
        })
        setTimeout(() => {
            setChanged(true)
        }, 1000);
    }

    useEffect(() => {
        getUserInfo();
        getVideosData();
        getComments();
    }, []);

    useEffect(() => {
        if (changed) {
          getUserInfo();
          getVideosData();
          getComments();
          setChanged(false);
         }
      }, [changed]);

    const handleClick = (buttonNumber) => {
        if (buttonNumber === 1) {
            getVideosData();
            setButton1Disabled(true);
            setButton2Disabled(false);
          } else if (buttonNumber === 2) {
            getComments();
            setButton2Disabled(true);
            setButton1Disabled(false);
          }
    }
    return (
    <>
        <body>
            <h2>{user.name} Activities</h2>
            <div className={AdminCenterCss.tableSelection}>
                <button onClick={() => handleClick(1)} disabled={button1Disabled} style={{ backgroundColor: button1Disabled ? 'white' : 'gray' }} >Videos released</button>
                <button onClick={() => handleClick(2)} disabled={button2Disabled} style={{ backgroundColor: button2Disabled ? 'white' : 'gray' }} >Comments published</button>
            </div>
            {button1Disabled ? (
                <table>
                <thead>
                    <tr>
                        <th>Video Title</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                        {videos.map((video) => (
                            <tr key={video._id}>
                            <td>{video.title}</td>
                            <td>{video.createdAt.slice(0, 10)}</td>
                            <div>
                            {video.isBlocked ? 
                                <button className={AdminCenterCss.redButton} value={"false/"+video._id} onClick={(e) => UpdateBlockStatus(e.target.value)}>Unblock</button>
                                :
                                <button className={AdminCenterCss.greenButton} value={"true/"+video._id} onClick={(e) => UpdateBlockStatus(e.target.value)}>Block</button>
                                }
                            </div>
                            </tr>
                        ))}
                </tbody>
            </table>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Video Title</th>
                            <th>Comment</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comments.map((comment) => (
                            <tr key={comment._id}>
                            <td>{comment.author}</td>
                            <td>{comment.content}</td>
                            <td>{comment.date.slice(0, 10)}</td>
                            <button className={AdminCenterCss.redButton} value={comment._id} onClick={(e) => DeleteComment(e.target.value)}>Delete</button>
                            </tr>
                        ))}
                    </tbody>
                </table>           
            )}
        </body>
    </>
    )
} 
export default AdminEdits