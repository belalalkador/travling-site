import React, { useState } from 'react';
import './Add.css';
import axios from 'axios';

const AddJourney = () => {
  const [formData, setFormData] = useState({
    NumOfTrip: null,
    timeOfTrip: '',
    timeToReach: '',
    destination_from: '',
    destination_to: '',
    busType: '2x2x2',
    totalSeats: 40,
    price: '', // New field for price
    timeOfDay: '', // New field for time of day
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalSeats' || name === 'price' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
  
    try {
      const response = await axios.post(
        'http://localhost:3000/companey/api/v1/add',
        formData,
        {
          withCredentials: true,
        }
      );
  
      if(response.data.success){
        setMessage('Journey added successfully!');
        setFormData({
          NumOfTrip: null,
          timeOfTrip: '',
          timeToReach: '',
          destination_from: '',
          destination_to: '',
          busType: '2x2x2',
          totalSeats: 40,
          price: '', // Reset price
          timeOfDay: '', // Reset timeOfDay
        });
      } else {
        setMessage(
          response?.data?.message || 'Failed to add journey. Please try again.'
        );  
      }
     
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Failed to add journey. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-journey-container">
      <h2>Add New Journey</h2>
      <form className="journey-form" onSubmit={handleSubmit}>
        <label>
          NumOfTrip:
          <input type="number" name="NumOfTrip" value={formData.NumOfTrip} onChange={handleChange} required />
        </label>
        <label>
          From:
          <input type="text" name="destination_from" value={formData.destination_from} onChange={handleChange} required />
        </label>

        <label>
          To:
          <input type="text" name="destination_to" value={formData.destination_to} onChange={handleChange} required />
        </label>

        <label>
          Departure Time:
          <input type="datetime-local" name="timeOfTrip" value={formData.timeOfTrip} onChange={handleChange} required />
        </label>

        <label>
          Arrival Time:
          <input type="datetime-local" name="timeToReach" value={formData.timeToReach} onChange={handleChange} required />
        </label>

        <label>
          Bus Type:
          <select name="busType" value={formData.busType} onChange={handleChange}>
            <option value="1x2x3">1x2x3</option>
            <option value="2x2x3">2x2x3</option>
            <option value="2x2x2">2x2x2</option>
            <option value="2x1x3">2x1x3</option>
          </select>
        </label>

        <label>
          Total Seats:
          <input type="number" name="totalSeats" value={formData.totalSeats} onChange={handleChange} required />
        </label>

        <label>
          Price:
          <input type="number" name="price" value={formData.price} onChange={handleChange} required />
        </label>

        <label>
          Time of Day:
          <select name="timeOfDay" value={formData.timeOfDay} onChange={handleChange} required>
            <option value="">Select Time of Day</option>
            <option value="before_noon">Before Noon</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
          </select>
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Journey'}
        </button>

        {message && <p className="form-message">{message}</p>}
      </form>
    </div>
  );
};

export default AddJourney;
