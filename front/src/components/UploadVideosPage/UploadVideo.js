import UploadVideoCss from "./UploadVideoPage.module.css";
import NavBar from "../NavBar/NavBar";
import { useState, useEffect} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import { CheckUser } from "../ApiSec/ApiSec";

const UploadVideoPage = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [videoFile, setVideoFile] = useState('');
    const [imageFile, setImageFile] = useState('');
    const [videoName, setVideoName] = useState('');
    const [thumbnailName, setThumbnailName] = useState('');
    const owner = Cookies.get('_id');
    const [loading, setLoading] = useState(false); 
    const [waitingTime, setWaintingTime] = useState(0);
    CheckUser();

    const goToProfile = () => {
        navigate("/Profile");
      };

    const send = async (event) => {
        event.preventDefault();
        const dataFormVid = new FormData();
        const dataFormThumb = new FormData();
        var videoSize = 0;
        dataFormVid.append("vFile", videoFile);
        dataFormThumb.append("tFile", imageFile);
        videoSize = videoFile.size;
        setWaintingTime((Math.ceil(videoSize/4000000)*1000))
        axios.post("http://localhost:4000/videos/uploadVideoFile/", dataFormVid)
            .then(res => console.log(res))
            .catch(err => console.log(err));

        axios.post("http://localhost:4000/videos/uploadThumbnailFile/", dataFormThumb)
            .then(res => console.log(res))
            .catch(err => console.log(err))

        setLoading(true);
       
        await axios.post("http://localhost:4000/videos/uploadVideo",
            JSON.stringify({ title, description, thumbnailName, videoName, owner, videoSize}),
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
    };
    useEffect(() => {
        if (loading) {
          setTimeout(() => {
            navigate("/Profile");
          }, 10000);
         }
      }, [loading]);

    return (
    <>
        <header>
            <NavBar/>
        </header>
        <body className={UploadVideoCss.upload_Body}>
            <div className={UploadVideoCss.upload_Div} contenteditable>
                <form action="#" className={UploadVideoCss.upload_Form}>
                    <h1>Upload your video !</h1>
                    <label>Thumbnail image</label>
                    <input type="file" accept=".png" name="tFile" onChange={event => {
                        let file = event.target.files[0];
                        let newFile = new File([file], parseInt(Math.random()*1000000000, 10)+".png", { type: file.type });
                        setThumbnailName(newFile.name)
                        setImageFile(newFile);
                    }} />
                    <label>Video to import</label>
                    <input type="file" name="vFile" accept="video/*" onChange={event => {
                        let file = event.target.files[0];
                        let newFile = new File([file], parseInt(Math.random()*1000000000, 10)+".mp4", { type: file.type });
                        setVideoName(newFile.name)
                        setVideoFile(newFile);
                    }} />
                    <label>Title :</label>
                    <input id="titleInput" onChange={(e) => setTitle(e.target.value)} value={title} required></input>
                    <label>Description :</label>
                    <span className={UploadVideoCss.textarea} role="textbox" id="textBoxSpan" onInput={(event) => setDescription(event.target.innerText)} required contentEditable ></span>
                    <button onClick={send}>{loading ? "Uploading..." : "Upload"}</button>
                </form>

            </div>
        </body>
    </>
    )
}

export default UploadVideoPage;