import { useState, useEffect } from 'react';
import { useUser } from '../../../context/Context';
import { Layout } from '../../../Layout/Layout';
import axios from 'axios';
import './MyReserv.css';

const MyReserv = () => {
  const { user } = useUser();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    pages: 1
  });

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3000/customer/api/v1/my-reserv/${user._id}?page=${pagination.page}&limit=${pagination.limit}`,
          { withCredentials: true }
        );

        if (response.data.success) {
          setReservations(response.data.data);
          setPagination({
            ...pagination,
            total: response.data.meta.total,
            pages: response.data.meta.pages
          });
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch reservations');
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
          fetchReservations();
    }
  }, [user?.userId, pagination.page]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.pages) {
      setPagination({ ...pagination, page: newPage });
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) return <Layout><div className="loading-spinner"></div></Layout>;
  if (error) return <Layout><div className="error-message">{error}</div></Layout>;

  return (
    <Layout>
      <div className="reservations-container">
        <h1 className="reservations-title">My Reservations</h1>
        
        {reservations.length === 0 ? (
          <div className="no-reservations">
            <p>You don't have any reservations yet.</p>
          </div>
        ) : (
          <>
            <div className="reservations-grid">
              {reservations.map((reservation) => (
                <div key={reservation._id} className="reservation-card">
                  <div className="reservation-header">
                    <h3>{reservation.journey.from} → {reservation.journey.to}</h3>
                    <span className={`status-badge ${reservation.journey.status}`}>
                      {reservation.journey.status}
                    </span>
                  </div>
                  
                  <div className="reservation-details">
                    <div className="detail-group">
                      <span className="detail-label">Seat Number:</span>
                      <span className="detail-value">{reservation.seatId}</span>
                    </div>
                    <div className="detail-group">
                      <span className="detail-label">Departure:</span>
                      <span className="detail-value">{formatDate(reservation.journey.departure)}</span>
                    </div>
                    <div className="detail-group">
                      <span className="detail-label">Bus Type:</span>
                      <span className="detail-value">{reservation.journey.busType}</span>
                    </div>
                    <div className="detail-group">
                      <span className="detail-label">Price:</span>
                      <span className="detail-value">${reservation.journey.price}</span>
                    </div>
                  </div>
                  
                  <div className="reservation-footer">
                    <span className="reservation-date">
                      Reserved on: {formatDate(reservation.createdAt)}
                    </span>
                    <button className="action-button">View Ticket</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pagination-controls">
              <button 
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Previous
              </button>
              <span>Page {pagination.page} of {pagination.pages}</span>
              <button 
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default MyReserv;