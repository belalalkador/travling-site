import { useState } from 'react';
import axios from 'axios';
import { Layout } from '../../Layout/Layout';
import { Link, useNavigate } from 'react-router-dom';
import bg from '../../assets/download-8.jpg';

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/user/api/v1/signup', formData);
      if (response.status === 200 || response.status === 201) {
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
      <div
        className="flex items-center justify-center min-h-screen px-4 bg-center bg-cover "
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="w-full max-w-md p-6 text-white shadow-xl bg-white/20 backdrop-blur-md rounded-2xl sm:p-8">
          <h1 className="mb-6 text-3xl font-bold text-center">Sign Up</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="px-4 py-3 text-white placeholder-gray-200 rounded-lg outline-none bg-white/30"
            />
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
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="px-4 py-3 text-white placeholder-gray-200 rounded-lg outline-none bg-white/30"
            />
            <input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              required
              className="px-4 py-3 text-white placeholder-gray-200 rounded-lg outline-none bg-white/30"
            />
            <select
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              required
              className="px-4 py-3 text-white placeholder-gray-200 rounded-lg outline-none bg-white/30"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <button
              type="submit"
              className="py-3 mt-2 font-semibold text-white transition-colors duration-300 rounded-lg bg-cyan-500 hover:bg-cyan-700"
            >
              Sign Up
            </button>
          </form>
          <p className="mt-6 text-sm text-center">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-green-300 hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default SignUp;
