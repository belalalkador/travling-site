import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const dummyStats = {
  totalJourneys: 124,
  totalReservations: 432,
  revenue: 15780, // in USD
};

const motivationalQuotes = [
  "Every journey begins with a single step. Keep moving forward!",
  "Travel not to escape life, but so life doesn't escape you.",
  "Great companies build great journeys.",
];

const getRandomQuote = () => {
  const idx = Math.floor(Math.random() * motivationalQuotes.length);
  return motivationalQuotes[idx];
};

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJourneys = async () => {
      try {
        const res = await axios.get('http://localhost:3000/companey/api/v1/journeys', { withCredentials: true });
        setJourneys(res.data.journeys);
      } catch (err) {
        console.error("Failed to fetch journeys:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJourneys();
  }, []);

  return (
    <div className="min-h-screen p-6 text-white bg-gradient-to-r from-cyan-700 via-blue-800 to-purple-900">
      <div className="max-w-5xl mx-auto">
        <h1 className="mb-6 text-4xl font-bold text-center">Welcome to the Company Dashboard</h1>
        <p className="max-w-3xl mx-auto mb-8 text-lg text-center">
          Here’s an overview of your company activity. You can manage journeys, view reports,
          and update your company details.
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-6 mb-10 md:grid-cols-3">
          <div className="p-6 rounded-lg shadow-lg bg-cyan-600">
            <h2 className="mb-2 text-2xl font-semibold">Total Journeys</h2>
            <p className="text-4xl font-bold">{dummyStats.totalJourneys}</p>
          </div>
          <div className="p-6 bg-blue-600 rounded-lg shadow-lg">
            <h2 className="mb-2 text-2xl font-semibold">Total Reservations</h2>
            <p className="text-4xl font-bold">{dummyStats.totalReservations}</p>
          </div>
          <div className="p-6 bg-purple-600 rounded-lg shadow-lg">
            <h2 className="mb-2 text-2xl font-semibold">Revenue (USD)</h2>
            <p className="text-4xl font-bold">${dummyStats.revenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Recent Journeys / Dynamic Journeys */}
        <section className="mb-10">
          <h2 className="pb-2 mb-4 text-3xl font-semibold border-b border-white/30">Recent Journeys</h2>

          {loading ? (
            <p className="text-lg italic text-center">Loading journeys...</p>
          ) : journeys.length === 0 ? (
            <p className="text-lg italic text-center">No journeys available.</p>
          ) : (
            <ul className="max-w-3xl mx-auto space-y-3">
              {journeys.map(journey => (
                <li
                  key={journey._id}
                  onClick={() => navigate(`/company-dashboard/journey-details/${journey._id}`)}
                  className="flex items-center justify-between p-4 transition rounded cursor-pointer bg-white/10 hover:bg-white/20"
                >
                  <div>
                    <span className="font-semibold">{journey.destination_from}</span> → <span className="font-semibold">{journey.destination_to}</span>
                  </div>
                  <div className="text-sm italic">
                    {journey.isDaily
                      ? "Daily"
                      : journey.daysOfWeek?.length
                      ? journey.daysOfWeek.join(", ")
                      : new Date(journey.timeOfTrip).toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Motivational Quote */}
        <blockquote className="max-w-3xl p-6 mx-auto text-lg italic text-center rounded shadow-lg bg-white/10">
          “{getRandomQuote()}”
        </blockquote>

        {/* Start Working Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/company-dashboard/add')}
            className="px-8 py-3 text-lg font-semibold transition rounded shadow-lg bg-cyan-500 hover:bg-cyan-600"
          >
            🚀 Start Working
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
