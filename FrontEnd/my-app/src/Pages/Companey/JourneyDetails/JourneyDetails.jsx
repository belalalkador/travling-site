import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const JourneyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [journey, setJourney] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchJourney = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/companey/api/v1/journey/${id}`,
          { withCredentials: true }
        );
        setJourney(res.data.journey);
      } catch (err) {
        setError("Failed to fetch journey details");
      } finally {
        setLoading(false);
      }
    };

    fetchJourney();
  }, [id]);

  const handleDeleteJourney = async () => {
    if (!window.confirm("Are you sure you want to delete this journey?")) return;

    try {
      await axios.delete(`http://localhost:3000/companey/api/v1/journey/${id}`, {
        withCredentials: true,
      });
      alert("Journey deleted successfully!");
      navigate("/company-dashboard/journeys"); // ✅ Use navigate
    } catch (err) {
      console.error(err);
      alert("Failed to delete journey.");
    }
  };

  const handleDeleteUser = async (seatIndex) => {
    try {
      await axios.patch(
        `http://localhost:3000/companey/api/v1/journey-seat/${id}`,
        { seatIndex },
        { withCredentials: true }
      );

      setJourney({
        ...journey,
        seats: journey.seats.map((s, i) =>
          i === seatIndex ? { ...s, user: null, status: "available", name: null, email: null, phone: null, age: null } : s
        ),
      });
    } catch (err) {
      console.log(err)
      alert("Failed to delete user");
    }
  };

  if (loading) return <p className="mt-10 text-center">Loading...</p>;
  if (error) return <p className="mt-10 text-center text-red-500">{error}</p>;
  if (!journey) return <p className="mt-10 text-center">No journey found</p>;

  return (
    <div className="max-w-5xl p-6 mx-auto">
      {/* Journey Info */}
      <div className="p-6 mb-8 bg-white border shadow-lg rounded-2xl">
        <h1 className="mb-4 text-3xl font-bold text-gray-800">
          Trip #{journey.NumOfTrip}
        </h1>
        <p className="mb-3 text-gray-600">
          From <span className="font-semibold">{journey.destination_from}</span>{" "}
          to <span className="font-semibold">{journey.destination_to}</span>
        </p>
        <div className="flex flex-wrap gap-3">
          <p className="px-3 py-1 text-sm text-blue-600 bg-blue-100 rounded-lg">
            Bus: {journey.busType}
          </p>
          <p className="px-3 py-1 text-sm text-green-600 bg-green-100 rounded-lg">
            Price: ${journey.price}
          </p>
          <p className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-lg">
            Seats: {journey.totalSeats}
          </p>
        </div>
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Available Days:</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            {journey.isDaily ? (
              <span className="px-3 py-1 text-sm text-purple-600 bg-purple-100 rounded-lg">
                Daily
              </span>
            ) : journey.daysOfWeek?.length ? (
              journey.daysOfWeek.map((day, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-sm text-purple-600 bg-purple-100 rounded-lg"
                >
                  {day}
                </span>
              ))
            ) : (
              <span className="italic text-gray-500">Not set</span>
            )}
          </div>
        </div>
      </div>

      {/* Users Table */}
     {/* Users Table */}
<div className="overflow-x-auto bg-white border shadow-md rounded-2xl">
  <table className="min-w-full border-collapse">
    <thead className="bg-gray-100">
      <tr>
        <th className="px-4 py-3 font-semibold text-left text-black">#</th>
        <th className="px-4 py-3 font-semibold text-left text-black">Name</th>
        <th className="px-4 py-3 font-semibold text-left text-black">Email</th>
        <th className="px-4 py-3 font-semibold text-left text-black">Phone</th>
        <th className="px-4 py-3 font-semibold text-center text-black">Actions</th>
      </tr>
    </thead>
    <tbody>
      {journey.seats?.map((seat, index) => (
        <tr key={index} className="transition border-t hover:bg-gray-50">
          <td className="px-4 py-3 text-black">{index + 1}</td>
          <td className="px-4 py-3 text-black">
            {seat.user ? seat.name : <span className="italic text-gray-400">Empty</span>}
          </td>
          <td className="px-4 py-3 text-black">
            {seat.user ? seat.email : <span className="italic text-gray-400">N/A</span>}
          </td>
          <td className="px-4 py-3 text-black">
            {seat.user ? seat.phone || "-" : <span className="italic text-gray-400">-</span>}
          </td>
          <td className="px-4 py-3 text-center">
            {seat.user ? (
              <button
                onClick={() => handleDeleteUser(index)}
                className="px-4 py-2 text-white transition bg-red-500 rounded-lg shadow hover:bg-red-600"
              >
                Delete
              </button>
            ) : (
              <span className="italic text-gray-400">No action</span>
            )}
          </td>
        </tr>
      ))}
      {journey.seats?.length === 0 && (
        <tr>
          <td colSpan={5} className="py-6 italic text-center text-gray-500">
            No seats available
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>


      <div className="mt-6 text-center">
        <button
          onClick={handleDeleteJourney}
          className="px-6 py-3 text-white transition bg-red-500 rounded-lg shadow hover:bg-red-600"
        >
          Delete Journey
        </button>
      </div>
    </div>
  );
};

export default JourneyDetails;
