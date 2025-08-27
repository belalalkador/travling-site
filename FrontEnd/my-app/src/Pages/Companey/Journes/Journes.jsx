import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AllJourneysPage = () => {
  const [journeys, setJourneys] = useState([]);
  const [filteredJourneys, setFilteredJourneys] = useState([]);
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJourneys = async () => {
      try {
        const res = await axios.get("http://localhost:3000/companey/api/v1/journeys", {
          withCredentials: true,
        });
        setJourneys(res.data.journeys);
        setFilteredJourneys(res.data.journeys);
      } catch (err) {
        console.error("خطأ في جلب الرحلات:", err.message);
      }
    };

    fetchJourneys();
  }, []);

  // filter whenever fromCity or toCity changes
  useEffect(() => {
    let filtered = journeys;

    if (fromCity.trim() !== "") {
      filtered = filtered.filter((j) =>
        j.destination_from.toLowerCase().includes(fromCity.toLowerCase())
      );
    }
    if (toCity.trim() !== "") {
      filtered = filtered.filter((j) =>
        j.destination_to.toLowerCase().includes(toCity.toLowerCase())
      );
    }

    setFilteredJourneys(filtered);
  }, [fromCity, toCity, journeys]);

  return (
    <div className="min-h-screen p-6 font-sans bg-gray-50">
      <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">
        جميع الرحلات
      </h1>

      {/* 🔎 Search inputs */}
      <div className="flex flex-col items-center justify-center gap-4 mb-6 sm:flex-row">
        <input
          type="text"
          placeholder="من مدينة..."
          value={fromCity}
          onChange={(e) => setFromCity(e.target.value)}
          className="w-64 px-4 py-2 text-black border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="إلى مدينة..."
          value={toCity}
          onChange={(e) => setToCity(e.target.value)}
          className="w-64 px-4 py-2 text-black border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-2xl">
        <table className="min-w-full text-sm text-gray-700">
          <thead>
            <tr className="text-gray-900 bg-gray-100 text-md">
              <th className="px-4 py-3">رقم الرحلة</th>
              <th className="px-4 py-3">من</th>
              <th className="px-4 py-3">إلى</th>
              <th className="px-4 py-3">وقت الانطلاق</th>
              <th className="px-4 py-3">الأيام</th>
              <th className="px-4 py-3">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {filteredJourneys.length > 0 ? (
              filteredJourneys.map((journey, idx) => (
                <tr
                  key={journey._id}
                  onClick={() =>
                    navigate(`/company-dashboard/journey-details/${journey._id}`)
                  }
                  className={`cursor-pointer hover:bg-gray-50 transition duration-150 ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-center text-gray-900">
                    {journey.NumOfTrip}
                  </td>
                  <td className="px-4 py-3 text-center">{journey.destination_from}</td>
                  <td className="px-4 py-3 text-center">{journey.destination_to}</td>
                  <td className="px-4 py-3 text-center">
                    {journey.timeOfTrip
                      ? new Date(journey.timeOfTrip).toLocaleString("ar-EG")
                      : journey.departureTime}
                  </td>
                  <td className="px-4 py-3 font-semibold text-center text-blue-600">
                    {journey.isDaily
                      ? "يوميًا"
                      : journey.daysOfWeek.length > 0
                      ? journey.daysOfWeek.join("، ")
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        journey.status === "active"
                          ? "bg-green-100 text-green-700"
                          : journey.status === "completed"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {journey.status === "active"
                        ? "نشطة"
                        : journey.status === "completed"
                        ? "مكتملة"
                        : "ملغاة"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-6 text-center text-gray-500"
                >
                  لا توجد نتائج مطابقة
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllJourneysPage;
