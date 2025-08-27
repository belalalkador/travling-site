import { useState } from 'react';
import { Layout } from '../../Layout/Layout';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../../Context/Context';
import bg from '../../assets/download-8.jpg';

function LogIn() {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/user/api/v1/login', formData, {
        withCredentials: true,
      });

      if (response.status === 200) {
        alert('Login successful! 🎉');
        setUser(response.data.user);
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
      <div
        className="flex items-center justify-center h-screen px-4 bg-center bg-cover"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="w-full max-w-md p-6 text-center text-white shadow-xl bg-white/20 backdrop-blur-md rounded-2xl sm:p-8">
          <h1 className="mb-6 text-3xl font-bold">Log In</h1>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="px-4 py-3 text-white placeholder-gray-200 rounded-lg outline-none bg-white/30"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="px-4 py-3 text-white placeholder-gray-200 rounded-lg outline-none bg-white/30"
            />
            <button
              type="submit"
              className="py-3 mt-2 font-semibold text-white transition-colors duration-300 rounded-lg bg-cyan-500 hover:bg-cyan-700"
            >
              Log In
            </button>
          </form>
          <p className="mt-6 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-green-300 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default LogIn;
 