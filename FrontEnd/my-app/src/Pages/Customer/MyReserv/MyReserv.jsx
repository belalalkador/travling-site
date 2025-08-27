import { useState, useEffect } from "react";
import { useUser } from "../../../Context/Context";
import { Layout } from "../../../Layout/Layout";
import axios from "axios";

const MyReserv = () => {
  const { user } = useUser();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [now, setNow] = useState(new Date()); // 👈 global timer tick

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        
        const response = await axios.get(
          `http://localhost:3000/customer/api/v1/my-reserv`,
          { withCredentials: true }
        );

        if (response.data.success) {
          console.log(response.data)
          const mapped = response.data.reservations.map((r) => ({
            ...r,
            journey: r.journeyId
              ? {
                  from: r.journeyId.destination_from,
                  to: r.journeyId.destination_to,
                  departure:
                    r.journeyId.departureTime || r.journeyId.timeOfTrip,
                  arrival: r.journeyId.arrivalTime,
                  busType: r.journeyId.busType,
                  price: r.journeyId.price,
                  status: r.journeyId.status,
                  isDaily: r.journeyId.isDaily,
                  daysOfWeek: r.journeyId.daysOfWeek,
                }
              : null,
          }));
          setReservations(mapped);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch reservations");
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchReservations();
    }
  }, [user?._id]);

  // ⏰ Update `now` every second for countdown
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?"))
      return;
    try {
      await axios.delete(
        `http://localhost:3000/customer/api/v1/my-reserv/${id}`,
        {
          withCredentials: true,
        }
      );
      setReservations((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete reservation");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const calcTimeLeft = (targetDate) => {
    if (!targetDate) return null;
    const diff = new Date(targetDate) - now;
    if (diff <= 0) return null;

    return {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  if (loading)
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen py-10">
          <div className="w-10 h-10 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
        </div>
      </Layout>
    );
  if (error)
    return (
      <Layout>
        <div className="py-6 text-center text-red-500">{error}</div>
      </Layout>
    );

  return (
    <Layout>
      <div className="min-h-screen px-4 py-8 mx-auto minmax-w-6xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">
          My Reservations
        </h1>

        {reservations.length === 0 ? (
          <div className="p-6 text-center text-gray-500 bg-gray-100 rounded-lg">
            You don't have any reservations yet.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {reservations.map((reservation) => {
              const countdown = calcTimeLeft(reservation.tripTime);

              return (
                <div
                  key={reservation._id}
                  className="p-6 transition bg-white border border-gray-200 shadow-lg rounded-xl hover:shadow-xl"
                >
                  {reservation.journey ? (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-700">
                          {reservation.journey.from} → {reservation.journey.to}
                        </h3>
                        <span
                          className={`px-3 py-1 text-sm rounded-full 
                          ${
                            reservation.journey.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {reservation.journey.status}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">Seat:</span>{" "}
                          {reservation.seatId}
                        </p>
                        <p>
                          <span className="font-medium">Departure:</span>{" "}
                          {reservation.journey.departure}
                        </p>
                        <p>
                          <span className="font-medium">Arrival:</span>{" "}
                          {reservation.journey.arrival || "N/A"}
                        </p>
                        <p>
                          <span className="font-medium">Bus Type:</span>{" "}
                          {reservation.journey.busType || "Standard"}
                        </p>
                        <p>
                          <span className="font-medium">Price:</span> $
                          {reservation.journey.price}
                        </p>
                        {reservation.journey.isDaily ? (
                          <p>
                            <span className="font-medium">Schedule:</span> Daily
                          </p>
                        ) : reservation.journey?.daysOfWeek?.length > 0 ? (
                          <p>
                            <span className="font-medium">Days:</span>{" "}
                            {reservation.journey.daysOfWeek.join(", ")}
                          </p>
                        ) : (
                          <p>
                            <span className="font-medium">Days:</span> Not
                            specified
                          </p>
                        )}
                        <p>
                          <span className="font-medium">Trip Time:</span>{" "}
                          {formatDate(reservation.tripTime)}
                        </p>
                        <p>
                          <span className="font-medium">Countdown:</span>{" "}
                          {countdown ? (
                            <span className="font-semibold text-blue-600">
                              {countdown.hours}h {countdown.minutes}m{" "}
                              {countdown.seconds}s
                            </span>
                          ) : (
                            <span className="font-semibold text-red-500">
                              Trip started
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-6 text-xs text-gray-500">
                        <span>Booked: {formatDate(reservation.createdAt)}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDelete(reservation._id)}
                            className="px-4 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="italic text-gray-500">
                      This journey no longer exists.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyReserv;
