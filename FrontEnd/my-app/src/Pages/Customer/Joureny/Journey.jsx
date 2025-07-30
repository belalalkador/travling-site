import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '../../../Layout/Layout';
import axios from 'axios';
import Seat from '../../../Componets/Seat/Seat';
import './Journey.css';

const Journey = () => {
  const { id } = useParams();
  const [journey, setJourney] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookedSeats, setBookedSeats] = useState(new Set()); // Using Set for better performance

  useEffect(() => {
    const fetchJourneyDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/customer/api/v1/company-journeys/${id}`,
          { withCredentials: true }
        );
        
        if (response.data.success) {
          setJourney(response.data.journey);
          // Convert bookedSeats array to Set for O(1) lookups
          setBookedSeats(new Set(response.data.journey.bookedSeats || []));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJourneyDetails();
  }, [id]);

  const renderSeatLayout = () => {
    if (!journey) return null;

    const busType = journey.busType || '2x2';
    const [leftCols = 2, rightCols = 2] = busType.split('x').map(Number);
    const totalSeats = journey.totalSeats || 40;
    const seatsPerRow = leftCols + rightCols;
    const numRows = Math.ceil(totalSeats / seatsPerRow);

    return Array.from({ length: numRows }, (_, rowIndex) => {
      const rowSeats = [];
      const startSeat = rowIndex * seatsPerRow + 1;
      const endSeat = Math.min(startSeat + seatsPerRow - 1, totalSeats);

      // Left seats
      for (let seatNum = startSeat; seatNum < startSeat + leftCols && seatNum <= endSeat; seatNum++) {
        rowSeats.push(
          <Seat
            key={`seat-${seatNum}`}
            number={seatNum}
            status={bookedSeats.has(seatNum) ? 'booked' : 'available'}
            seatId={seatNum}
            journeyId={id}
          />
        );
      }

      // Aisle
      rowSeats.push(<div key={`aisle-${rowIndex}`} className="aisle" />);

      // Right seats
      for (let seatNum = startSeat + leftCols; seatNum <= endSeat; seatNum++) {
        rowSeats.push(
          <Seat
            key={`seat-${seatNum}`}
            number={seatNum}
            status={bookedSeats.has(seatNum) ? 'booked' : 'available'}
            seatId={seatNum}
            journeyId={id}
          />
        );
      }

      return (
        <div key={`row-${rowIndex}`} className="seat-row">
          {rowSeats}
        </div>
      );
    });
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!journey) return <div className="not-found">Journey not found</div>;

  return (
    <Layout>
      <div className="journey-wrapper">
        <h2 className="bus-front">🚌 Front of Bus</h2>
        <div className="seat-container">{renderSeatLayout()}</div>
      </div>
    </Layout>
  );
};

export default Journey;