import React from "react";
import NavBar from "../NavBar/NavBar";
import { useState, useEffect } from 'react';
import AdminCenterCss from "./AdminCenter.module.css"
import { CheckUser } from "../ApiSec/ApiSec";

const AdminCenter = () => {

    const [userList, setUserList] = useState([]);
    const [numberOfUsers, setNumberOfUsers] = useState();
    const [searchParam, setSearchParam] = useState("");
    const [firstList, setFirstList] = useState([]);
    const [changed, setChanged] = useState(false);
    const [videosStat,setVideosStat] = useState([]);

    CheckUser();
    
    const getListOfUsers = () => {
        fetch("http://localhost:4000/admin/stats/videos", {
            credentials: 'include'
          })
          .then(response => {
            return response.json()
        })
        .then(data => {
            setVideosStat(data);
        })
        fetch("http://localhost:4000/admin/allUsers", {
            credentials: 'include'
          })
        .then(response => {
            return response.json()
        })
        .then(data => {
            setUserList(Object.values(data));
            setFirstList(Object.values(data));
            setNumberOfUsers(Object.keys(data).length);
        })
    }
    const AdminDetails = (status) => {
        window.location.href = '/AdminEdits/' + status
    }
    const SearchUser = (status) => {
        if(status !== "") {
            const results = userList.filter(element => {
                const stringElement = element.name.toString().toLowerCase(); 
                return stringElement.includes(status.toLowerCase());
              })
            setUserList(results);
            setChanged(true);

        }else {
            setUserList(firstList);
            setChanged(true);
        }
    }

    useEffect(() => {
        getListOfUsers();
    }, []);
    
    useEffect(() => {    
        setChanged(false);
    }, [changed]);
    return (
        <>
            <header>
                <NavBar/>
            </header>
            <body>
                <h2>Admin Center Page</h2>
                <h3>Current number of sign-up Users : {numberOfUsers}</h3>
                {videosStat.videosCount === 0 ?
                    <h3>No videos uploaded yet !</h3>
                    :
                    <h3>{videosStat.videosCount} posted videos with a total size of : {videosStat.totalSize} Mo</h3>
                }
                <input className={AdminCenterCss.customInput} placeholder="Find a particular User" onChange={(e) => SearchUser(e.target.value)}></input>
                <table>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Is Verified</th>
                            <th>User since</th>
                        </tr>
                    </thead>
                    <tbody>
                    {userList.map((user) => (
                            <tr>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{""+user.isVerified}</td>
                                <td>{user.createdAt.slice(0, 10)}</td>
                                <button value={user._id} onClick={(e) => AdminDetails(e.target.value)}>Edit</button>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </body>
        </>
    )
}

export default AdminCenter;