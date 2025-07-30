import React from 'react';
import { Layout } from '../../Layout/Layout';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';
import { useUser } from '../../Context/Context';


function Profile() {
  const { user,setUser}=useUser()
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? 😥')) {
      try {
        const response = await axios.delete(`http://localhost:3000/user/api/v1/delete`, {
          withCredentials: true, // if you use cookies (session/token)
        });
        if (response.status === 200) {
          alert('Account deleted successfully.');
          setUser(null)
          navigate('/'); // Redirect to home
        } else {
          alert('Failed to delete account.');
        }
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Something went wrong.');
      }
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(`http://localhost:3000/user/api/v1/logout`, {}, {
        withCredentials: true, 
      });
      if (response.status === 200) {
        alert('Logged out successfully.');
        setUser(null)
        navigate('/login');
      } else {
        alert('Failed to log out.');
      }
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Something went wrong.');
    }
  };

  return (
    <Layout>
      <div className="profile-background">
        <div className="profile-glass">
          <h1 className="profile-title">Hello, {user?.name} 👋</h1>
          <p>Email: {user?.email}</p>
          <p>Phone: {user?.phone}</p>
          <p>Birthday: {user?.birthday}</p>
          <p>Sex: {user?.sex}</p>

          <div className="profile-buttons">
            <button className="edit-btn" onClick={handleEditProfile}>Edit Profile</button>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
            <button className="delete-btn" onClick={handleDeleteAccount}>Delete Account</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Profile;
