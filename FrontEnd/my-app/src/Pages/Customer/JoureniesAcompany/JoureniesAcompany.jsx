import { Link, useLocation } from "react-router-dom";
import { Layout } from "../../../Layout/Layout";

const JoureniesAcompany = () => {
  const location = useLocation();
  const journeys = location?.state?.journeys;
   console.log(journeys)
  if (!Array.isArray(journeys)) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-gradient-to-r from-gray-100 via-gray-200 to-blue-100">
          <h2 className="mb-4 text-3xl font-bold text-gray-800">Available Journeys</h2>
          <p className="text-lg text-gray-600">No journey data provided.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen px-6 py-10 bg-gradient-to-r from-gray-300 via-gray-400 to-blue-300">
        <h2 className="mb-8 text-3xl font-bold text-center text-gray-800">
          Available Journeys
        </h2>

        {journeys?.length !== 0 ? (
         <div className="flex flex-wrap justify-center gap-6">
  {journeys?.map((journey, index) => (
    <Link
      to={`/reserve/company-journeys/${journey._id}`}
      key={journey._id || index}
      className="relative p-6 transition-transform duration-300 bg-white border border-gray-200 shadow-md w-80 rounded-2xl hover:scale-105 hover:shadow-2xl hover:border-blue-500"
    >
      {/* Trip Header */}
      <h3 className="mb-3 text-2xl font-bold text-blue-600">
        🚍 Trip #{journey.NumOfTrip ?? index + 1}
      </h3>

      {/* From → To */}
      <p className="mb-2 text-lg text-gray-800">
        <span className="font-semibold">From:</span> {journey.destination_from ?? "N/A"}
      </p>
      <p className="mb-4 text-lg text-gray-800">
        <span className="font-semibold">To:</span> {journey.destination_to ?? "N/A"}
      </p>

      {/* Times */}
      <div className="flex justify-between mb-3">
        <p className="text-gray-700">
          ⏰ <span className="font-semibold">Departure:</span> {journey.departureTime ?? "N/A"}
        </p>
        <p className="text-gray-700">
          🕒 <span className="font-semibold">Arrival:</span> {journey.arrivalTime ?? "N/A"}
        </p>
      </div>

      {/* Daily or days of week */}
      {journey.isDaily ? (
        <p className="mb-3 font-medium text-green-600">✅ Daily Trip</p>
      ) : (
        <p className="mb-3 text-gray-700">
          <span className="font-semibold">Days:</span>{" "}
          {Array.isArray(journey.daysOfWeek) && journey.daysOfWeek.length > 0
            ? journey.daysOfWeek.join(", ")
            : "Not specified"}
        </p>
      )}

      {/* Seats & Price */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-gray-700">
          💺 <span className="font-semibold">Seats:</span> {journey.totalSeats ?? "N/A"}
        </p>
        <p className="font-semibold text-gray-800 text-blue-600">
          💵 {journey.price ? `${journey.price} SYP` : "N/A"}
        </p>
      </div>

      {/* Time of Day */}
      <p className="text-gray-700">
        🌅 <span className="font-semibold">Time of Day:</span> {journey.timeOfDay ?? "N/A"}
      </p>

      {/* Hover glow effect */}
      <div className="absolute inset-0 transition-colors duration-300 border-2 border-transparent pointer-events-none rounded-2xl hover:border-blue-400"></div>
    </Link>
  ))}
</div>

        ) : (
          <p className="text-lg text-center text-gray-600">
            No journeys available for this company.
          </p>
        )}
      </div>
    </Layout>
  );
};

export default JoureniesAcompany;
