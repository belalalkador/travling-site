import React, { useState } from 'react';
import { Layout } from '../../Layout/Layout';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LogIn.css'; // Make sure you have the styles
import { useUser } from '../../Context/Context';

function LogIn() {
  const {setUser}=useUser()
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/user/api/v1/login', formData,{
        withCredentials:true,
      });
      
      if (response.status === 200) {
        alert('Login successful! 🎉');
        setUser(response.data.user)
       
        navigate('/'); 
      } else {
        alert('Login failed.');
      }
    } catch (error) {
      console.error('Login error:', error.response?.data?.message || error.message);
      alert(error.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <Layout>
      <div className="login-background">
        <div className="login-glass">
          <h1 className="login-title">Log In</h1>
          <form className="login-form" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit">Log In</button>
          </form>
          <p className="login-signup">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default LogIn;
