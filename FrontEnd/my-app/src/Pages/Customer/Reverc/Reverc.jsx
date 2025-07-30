import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../../../Layout/Layout';
import axios from 'axios';
import './Reverc.css';
import { useUser } from '../../../Context/Context';

const Reverc = () => {
  const nav=useNavigate()
  const { id, seatId } = useParams();
  const{user}=useUser()
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
  const res= await axios.post(`http://localhost:3000/customer/api/v1/make-reserv`, {
       userId:user._id,
        journeyId: id,
        seatId,
        ...formData
      }, {
        withCredentials: true
      });
      if(res.success){

        setMessage('✅ Reservation successful!');
       nav(`/reserve/company-journeys/${id}`)
      }

    } catch (err) {
      setMessage(`❌ Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="reverc-wrapper">
        <h2>Reserve Your Seat</h2>
    
        <form className="reverc-form" onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Full Name" required onChange={handleChange} />
          <input type="tel" name="phone" placeholder="Phone Number" required onChange={handleChange} />
          <input type="number" name="age" placeholder="Age" required onChange={handleChange} />
          <input type="email" name="email" placeholder="Email Address" required onChange={handleChange} />
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Reserve Now'}
          </button>
        </form>

        {message && <p className="reverc-message">{message}</p>}
      </div>
    </Layout>
  );
};

export default Reverc;
