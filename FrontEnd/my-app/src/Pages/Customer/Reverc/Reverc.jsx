import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../../../Layout/Layout';
import axios from 'axios';
import { useUser } from '../../../Context/Context';

const Reverc = () => {
  const nav = useNavigate();
  const { id, seatId } = useParams();
  const { user } = useUser();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: '',
    email: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await axios.post(
        `http://localhost:3000/customer/api/v1/make-reserv`,
        {
          userId: user._id,
          journeyId: id,
          seatId,
          ...formData
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        setMessage('✅ Reservation successful!');
        nav(`/reserve/company-journeys/${id}`);
      }
    } catch (err) {
      setMessage(`❌ Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="h-screen flex items-center justify-center bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364] px-4">
        <div className="w-full max-w-md p-8 text-center border shadow-lg bg-white/5 backdrop-blur-lg border-white/10 rounded-2xl animate-fadeIn">
          <h2 className="mb-6 text-2xl font-semibold text-gray-300">Reserve Your Seat</h2>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              onChange={handleChange}
              className="px-4 py-3 rounded-xl bg-white/10 placeholder-gray-400 text-white focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] transition"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              required
              onChange={handleChange}
              className="px-4 py-3 rounded-xl bg-white/10 placeholder-gray-400 text-white focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] transition"
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              required
              onChange={handleChange}
              className="px-4 py-3 rounded-xl bg-white/10 placeholder-gray-400 text-white focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] transition"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              onChange={handleChange}
              className="px-4 py-3 rounded-xl bg-white/10 placeholder-gray-400 text-white focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] transition"
            />

            <button
              type="submit"
              disabled={loading}
              className={`py-3 rounded-xl font-bold text-white transition-transform duration-200 ${
                loading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-[#00b4d8] hover:bg-[#0077b6] hover:-translate-y-1'
              }`}
            >
              {loading ? 'Processing...' : 'Reserve Now'}
            </button>
          </form>

          {message && (
            <p className="mt-4 font-bold text-green-300 animate-fadeIn">{message}</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Reverc;
