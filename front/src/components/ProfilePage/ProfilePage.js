import ProfilePageCss from  "./ProfilePage.module.css"
import NavBar from "../NavBar/NavBar";
import { useState, useEffect, useRef } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { CheckUser } from "../ApiSec/ApiSec";
import Avatar from "../../assets/img_avatar.png";
import Cookies from "js-cookie";
import axios from "axios";

const ProfilePage = () => {

  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [userPP, setUserPP] = useState('');
  const userid = Cookies.get('_id');
  const [videos, setVideos] = useState([]);
  const [changed, setChanged ] = useState(false); 
  const fileInputRef = useRef(null);
  CheckUser();

  const navigateToUpdateProfile = () => {
    // 👇️ navigate to /
    navigate('/UpdateProfile');
  };
  const navigateToModifyPassword = () => {
    // 👇️ navigate to /
    navigate('/ModifyPassword');
  };

  const UpdateHiddenStatus= (status) => {
    const pos = status.indexOf("/");
    const bool = status.substr(0, pos);
    const _id = status.substr(pos+1)

    axios.put("http://localhost:4000/videos/HiddenStatus/"+_id, {
      isHidden: bool
    })
    setChanged(true);
  }

  const fetchUserData = async () => {
    fetch("http://localhost:4000/users/getUser/"+ userid)
      .then(response => {
        return response.json()
      })
      .then(data => {
        setUser(data)
      }
      )  
      const fetchVideos = async () => {
        try {
          const response = await fetch(`http://localhost:4000/videos/${userid}`);
          const videoData = await response.json();  
          const videoDataWithThumbnails = await Promise.all(
            videoData.map(async (video) => {
              const thumbnailResponse = await fetch(
                `http://localhost:4000/videos/thumbnail/${video.thumbnail}`
              );
              const blob = await thumbnailResponse.blob();
              const thumbnailUrl = URL.createObjectURL(blob);
  
              return {
                ...video,
                thumbnailUrl,
              };
            })
          );
  
          setVideos(videoDataWithThumbnails);
        } catch (error) {
          console.error('Error fetching videos:', error);
        }
      };
      fetchVideos();
  }

  const getPP = async () => {
    const pPResponse = await fetch(
      `http://localhost:4000/users/getProfilepicture/${user.profilePicture}`
    );
    const blob = await pPResponse.blob();
    const pPUrl = URL.createObjectURL(blob);
    setUserPP(pPUrl);
  };

  const handleImageClick = async () => {
    fileInputRef.current.click();
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    let newFile = new File([file], parseInt(Math.random()*1000000000, 10)+".png", { type: file.type });
    const dataProfilePic = new FormData();
    dataProfilePic.append("profilePic",newFile);
    axios.post("http://localhost:4000/users/uploadProfilePicture", dataProfilePic)
    axios.put('http://localhost:4000/users/updateProfile/'+userid, {
      profilePicture : newFile.name
    },
    {
      withCredentials: true
    })
    axios.post("http://localhost:4000/users/deletePreviousPP/"+user.profilePicture);
    setTimeout(() => {
      setChanged(true);
    }, 1000);
  };

  const handleSearchInputChange = (event) => {
      if (window.location.pathname !== "/") {
        navigate("/");
      }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (changed) {
      fetchUserData();
      setChanged(false);
     }
  }, [changed]);

  useEffect(() => {
      getPP();
  }, [user]);

  return (
    <>
    <header>
      <NavBar onSearchInputChange={handleSearchInputChange}/>
    </header>
    <body className={ProfilePageCss.mainBody}>
      <div className={ProfilePageCss.profileDivPrimary}>
        <div className={ProfilePageCss.profileDivTitle}>
            <h1>My profile</h1>
        </div>
        <div className={ProfilePageCss.profileDivSecondary}>
          <div className={ProfilePageCss.profileDivImage}>
            <button type="file" onClick={handleImageClick}>
              {user.profilePicture === "default" ?
              <img className={ProfilePageCss.userimg} src={Avatar}/>
              :
              <img className={ProfilePageCss.userimg} src={userPP}/>
              }
              <input type="file" accept=".png" name="ProfilePicture" style={{ display: 'none' }} ref={fileInputRef}  onChange={handleFileSelect}/>
              </button>
            <button onClick={navigateToUpdateProfile}>Update Profile</button>
          </div>
          <div className={ProfilePageCss.profileDivInfo}>
            <h2>Your UserName</h2>
            <h3>{user.name}</h3>
            <h2>Your Email</h2>
            <h3>{user.email}</h3>
            <button onClick={navigateToModifyPassword}>Modify Password</button>
          </div>
        </div>
      </div>
      <div className={ProfilePageCss.profileDivUploads}>
        <h1>Your Uploads</h1>
        <button onClick={event => window.location.href = "/UploadVideo"}>Upload a new video !</button>
          <div className={ProfilePageCss.videoBarContainer}>
            {videos.map((video) => (
            <div className={ProfilePageCss.singleVideoDiv} key={video.thumbnail}>
              <img src={video.thumbnailUrl} alt="Thumbnail" onClick={()=> navigate("/Video/"+video.videoName.substr(0,video.videoName.indexOf("."))+"/"+video._id)}/>
              <h3>{video.title}</h3>
              <div>
                {video.isHidden ? 
                <button className={ProfilePageCss.redButton} value={"false/"+video._id} onClick={(e) => UpdateHiddenStatus(e.target.value)}>Make visible</button>
                :
                <button className={ProfilePageCss.greenButton} value={"true/"+video._id} onClick={(e) => UpdateHiddenStatus(e.target.value)}>Hide</button>
                }
              </div>
            </div>
            ))}
          </div>
      </div>
    </body>
    </>
    );
};

export default ProfilePage;