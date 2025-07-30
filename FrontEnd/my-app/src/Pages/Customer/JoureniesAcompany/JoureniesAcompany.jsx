import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout } from '../../../Layout/Layout';
import './Jor.css'; // Optional CSS file

const JoureniesAcompany = () => {
  const location = useLocation();
  const journeys = location?.state?.journeys;

  if (!Array.isArray(journeys)) {
    return (
      <Layout>
        <div className="journeys-container">
          <h2 className="journeys-title">Available Journeys</h2>
          <p className="no-journeys">No journey data provided.</p>
        </div>
      </Layout>
    );
  }
       console.log(journeys);
  return (
    <Layout>
      <div className="journeys-container">
        <h2 className="journeys-title">Available Journeys</h2>

        {journeys?.length !== 0 ? (
        <div className="journey-list">
        {journeys?.map((journey, index) => (
          <Link to={`/reserve/company-journeys/${journey._id}`} key={journey._id || index} className="journey-card">
            <h3>Trip #{journey.NumOfTrip}</h3>
            <p><strong>From:</strong> {journey.destination_from ?? 'N/A'}</p>
            <p><strong>To:</strong> {journey.destination_to ?? 'N/A'}</p>
            <p><strong>Date:</strong> {journey.date ? new Date(journey.date).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Departure Time:</strong> {journey.timeOfDay ?? 'N/A'}</p>
            <p><strong>Duration:</strong> {journey.duration ?? 'N/A'}</p>
            <p><strong>Total Seats:</strong> {journey.totalSeats ?? 'N/A'}</p>
          </Link>
        ))}
      </div>
        ) : (
            <p className="no-journeys">No journeys available for this company.</p>
          
        )}
      </div>
    </Layout>
  );
};

export default JoureniesAcompany;
