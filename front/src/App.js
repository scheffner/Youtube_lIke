import React, { useState}from 'react' ;
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import Register  from './components/RegisterPage/Register';
import ProfilePage from './components/ProfilePage/ProfilePage';
import HomePage from './components/HomePage/HomePage';
import Login from './components/LoginPage/LoginPage';

import './App.css'
import UpdateProfilePage from './components/UpdateProfilePage/UpdateProfilePage';
import ModifyPasswordPage from './components/ModifyPassworPage/ModifyPasswordPage';
import VideoPage from './components/VideoPage/VideoPage';
import AdminCenter from './components/AdminPage/AdminCenter';
import AdminEdits from './components/AdminPage/AdminEdits';
import UploadVideoPage from './components/UploadVideosPage/UploadVideo';


const App = () => {
    return (
        <>
        <Routes>
          <Route path='/Register' element={<Register/>}/>
          <Route path='/Login' element={<Login/>}/>
          <Route path='/' element={<HomePage/>}/>
          <Route path='/Profile' element={<ProfilePage/>}/>
          <Route path='/UpdateProfile' element={<UpdateProfilePage/>}/>
          <Route path='/ModifyPassword' element={<ModifyPasswordPage/>}/>
          <Route path='/Video/:filename/:videoId' element={<VideoPage/>}/>
          <Route path='/AdminCenter' element={<AdminCenter/>}/>
          <Route path='/AdminEdits/:_id' element={<AdminEdits/>}/>
          <Route path='/UploadVideo' element={<UploadVideoPage/>}/>
        </Routes>
      </>
    );
}

export default App;