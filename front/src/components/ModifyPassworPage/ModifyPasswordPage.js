import { useState } from 'react';
import axios from 'axios';
import ModifyPasswordCss from './ModifyPasswordPage.module.css';
import Cookies from 'js-cookie';


const ModifyPasswordPage = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validate form inputs
    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirm password don't match");
      return;
    }

    // Send request to reset password
    try {
      const userName = Cookies.get('userName')
      const response = await axios.post('http://localhost:4000/users/resetpassword', {
        userName,
        oldPassword,
        newPassword
      });
      setSuccessMessage(response.data);
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <body>
      <div className={ModifyPasswordCss.mainDiv}>
        <h2>Your Old Password</h2>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <h2>New Password</h2>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <h2>Confirm Password</h2>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {errorMessage && <p className={ModifyPasswordCss.error}>{errorMessage}</p>}
        {successMessage && <p className={ModifyPasswordCss.success}>{successMessage}</p>}
        <br />
        <button onClick={handleFormSubmit}>Change Password</button>
      </div>
    </body>
  );
};

export default ModifyPasswordPage;
