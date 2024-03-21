import React, { useEffect, useState } from 'react';
import HomePageCss from "./HomePage.module.css"
import NavBar from '../NavBar/NavBar';
import { useNavigate } from 'react-router-dom';
import { CheckUser } from '../ApiSec/ApiSec.js';

const HomePage = () => {
  const [videos, setVideos] = useState([]);
  const [firstFetch, setFirstFetch] = useState([]);
  const [changed, setChanged] = useState(false);
  const navigate = useNavigate();
  CheckUser();
  
  const fetchVideos = async () => {
    const response = await fetch("http://localhost:4000/videos");
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
          setFirstFetch(videoDataWithThumbnails)
  }

  const handleSearchInputChange = (event) => {
    if(event.target.value !== "") {
      const results = videos.filter(element => {
          const titleElement = element.title.toString().toLowerCase(); 
          return titleElement.includes(event.target.value.toLowerCase());
        })
      setVideos(results);
      setChanged(true);

  }else {
      setVideos(firstFetch);
      setChanged(true);
  }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
      setChanged(false);
  }, [changed]);

  return (
    <>
    <header>
      <NavBar onSearchInputChange={handleSearchInputChange} ></NavBar>
    </header>
    <body>
      <div className={HomePageCss.videosDiv}>
        {videos.length === 0 ?
          <h1>Sadly no videos can be found yet !</h1>
          :
            <div className={HomePageCss.rowContainer}>
              {videos.map((video) => (
                <div className={HomePageCss.singleVid} key={video.thumbnail}>
                  <img src={video.thumbnailUrl} alt="Thumbnail" onClick={()=> navigate("/Video/"+video.videoName.substr(0,video.videoName.indexOf("."))+"/"+video._id)}/>
                  <h3>{video.title}</h3>
                </div>
              ))}
            </div>
        }
      </div>
    </body>
    </>
)
}
export default HomePage;