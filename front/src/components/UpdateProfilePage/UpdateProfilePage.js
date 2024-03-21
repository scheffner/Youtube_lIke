import UpdateProfileCss from  "./UpdateProfilePage.module.css"
import { useState, useEffect } from 'react';
import Cookies from "js-cookie";
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import { CheckUser } from "../ApiSec/ApiSec";

const UpdateProfilePage = () => {

    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const userId = Cookies.get('_id');
    const token = Cookies.get('access_token');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    CheckUser();

    const navigateToProfile = () => {
      // 👇️ navigate to /
      navigate('/Profile');
    };

    const fetchUserData = () => {
        fetch("http://localhost:4000/users/getUser/"+ userId)
          .then(response => {
            return response.json()
          })
          .then(data => {
            setUsers(data)
            setName(data.name)
            setEmail(data.email)
          })
      }
      useEffect(() => {
        fetchUserData();
      }, []);

      const handleSubmit = (e) => {
        axios.put('http://localhost:4000/users/updateProfile/'+userId,{
            name: name,
            email: email
         },
         {
          withCredentials: true
         })
         setTimeout(() => {
          navigateToProfile();
      }, 1500);
      }

    return (
      <>
      <body>
        <div className={UpdateProfileCss.mainDiv}>
          <form className={UpdateProfileCss.formMain}>
            <h2>Your Username</h2>
            <input name="nameinput" type="text" defaultValue={users.name} onChange={(e) => setName(e.target.value)}></input>
            <h2>Your Email</h2>
            <input name="emailinput" type="text" defaultValue={users.email} onChange={(e) => setEmail(e.target.value)}></input>
            
          </form>
          <button onClick={handleSubmit}>Validate Changes</button>
        </div>
      </body>
      </>
      );
  };
  
  export default UpdateProfilePage;