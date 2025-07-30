import React, { useState } from 'react';
import axios from 'axios'; // <<< Add this import at top
import { Layout } from '../../Layout/Layout';
import { Link, useNavigate } from 'react-router-dom';
import './SignUp.css'; // You can reuse the LogIn.css and just add small updates

function SignUp() {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    birthday: '',
    sex: '',
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/user/api/v1/signup', formData);
  
      if (response.status === 201 || response.status === 200) {
        alert('Sign Up Successful! 🎉');
        navigate('/login'); 
      } else {
        alert('Sign Up Failed!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.message || 'Something went wrong.');
    }
  };
  
  return (
    <Layout>
      <div className="login-background">
        <div className="login-glass">
          <h1 className="login-title">Sign Up</h1>
          <form className="login-form" onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
            <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} required />
            <select name="sex" value={formData.sex} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <button type="submit">Sign Up</button>
          </form>
          <p className="login-signup">
            Already have an account? <Link to="/login">Log In</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default SignUp;
