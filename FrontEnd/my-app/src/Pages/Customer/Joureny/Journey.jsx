import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "../../../Layout/Layout";
import axios from "axios";
import Seat from "../../../Componets/Seat/Seat";

const Journey = () => {
  const { id } = useParams();
  const [journey, setJourney] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookedSeats, setBookedSeats] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJourneyDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/customer/api/v1/company-journeys/${id}`,
          { withCredentials: true }
        );

        if (response.data.success) {
          setJourney(response.data.journey);
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

    const busType = journey.busType || "2x2";
    const [leftCols = 2, rightCols = 2] = busType.split("x").map(Number);
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
            seatNumber={seatNum}
            isBooked={bookedSeats.has(seatNum)}
            journeyId={id}
            onClick={() => navigate(`/reserve/company-journeys/${id}/${seatNum}`)}
          />
        );
      }

      // Aisle
      rowSeats.push(<div key={`aisle-${rowIndex}`} className="w-10 h-2"></div>);

      // Right seats
      for (let seatNum = startSeat + leftCols; seatNum <= endSeat; seatNum++) {
        rowSeats.push(
          <Seat
            key={`seat-${seatNum}`}
            seatNumber={seatNum}
            isBooked={bookedSeats.has(seatNum)}
            journeyId={id}
            onClick={() => navigate(`/reserve/company-journeys/${id}/${seatNum}`)}
          />
        );
      }

      return (
        <div key={`row-${rowIndex}`} className="flex items-center justify-center gap-2">
          {rowSeats}
        </div>
      );
    });
  };

  if (loading) return <div className="py-10 text-lg text-center">Loading...</div>;
  if (error) return <div className="py-10 text-center text-red-600">Error: {error}</div>;
  if (!journey) return <div className="py-10 text-center">Journey not found</div>;

  return (
    <Layout>
      <div className="flex flex-col items-center min-h-screen px-4 py-10 bg-gradient-to-b from-blue-100 via-white to-blue-200">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">🚌 Front of Bus</h2>
        <div className="flex flex-col gap-3">{renderSeatLayout()}</div>
      </div>
    </Layout>
  );
};

export default Journey;
