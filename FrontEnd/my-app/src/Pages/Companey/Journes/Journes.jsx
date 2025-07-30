import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Journes.css"; // نربط ملف CSS

const AllJourneysPage = () => {
  const [journeys, setJourneys] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJourneys = async () => {
      try {
        const res = await axios.get("http://localhost:3000/companey/api/v1/journeys", {
          withCredentials:true,
        });
          setJourneys(res.data.journeys);
      } catch (err) {
        console.error("خطأ في جلب الرحلات:", err.message);
      }
    };

    fetchJourneys();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
  
    const confirmDelete = window.confirm("هل أنت متأكد أنك تريد حذف هذه الرحلة؟");
  
    if (!confirmDelete) return;
  
    try {
      await axios.delete(`http://localhost:3000/companey/api/v1/journey/${id}`, {
        withCredentials: true,
      });
      setJourneys(journeys.filter((j) => j._id !== id));
    } catch (err) {
      console.error("فشل في حذف الرحلة:", err.message);
    }
  };
  

  const handleToggleActive = async (id, isActive, e) => {
    e.stopPropagation();
    try {
      await axios.put(`http://localhost:3000/companey/api/v1/journey/${id}/toggle`, { isActive }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setJourneys(journeys.map(j => j._id === id ? { ...j, isActive } : j));
    } catch (err) {
      console.error("فشل في تغيير حالة الرحلة:", err.message);
    }
  };

  return (
    <div className="journey-container">
      <h1 className="journey-title">جميع الرحلات</h1>
      <table className="journey-table">
        <thead>
          <tr>
            <th>رقم الرحلة</th>
            <th>من</th>
            <th>إلى</th>
            <th>وقت الانطلاق</th>
            <th>مفعلة</th>
            <th>الخيارات</th>
          </tr>
        </thead>
        <tbody>
          {journeys.map((journey) => (
            <tr
              key={journey._id}
              onClick={() => navigate(`/company-dashboard/journey-details/${journey._id}`)}
              className="journey-row"
            >
              <td>{journey.NumOfTrip}</td>
              <td>{journey.destination_from}</td>
              <td>{journey.destination_to}</td>
              <td>{journey.timeOfTrip}</td>
              <td>
                <input
                  type="checkbox"
                  checked={journey.isActive}
                  onChange={(e) => handleToggleActive(journey._id, e.target.checked, e)}
                />
              </td>
              <td>
                <button
                  className="delete-btn"
                  onClick={(e) => handleDelete(journey._id, e)}
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllJourneysPage;
