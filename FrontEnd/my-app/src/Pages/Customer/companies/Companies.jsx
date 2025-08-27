import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Layout } from "../../../Layout/Layout";

const Companies = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { companies = [], data = {} } = location.state || {};
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    if (Array.isArray(companies) && companies.length > 0 && !selectedCompany) {
      setSelectedCompany(companies[0]);
    }
  }, [companies, selectedCompany]);

  const handleShowJourneys = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/customer/api/v1/company-journeys",
        {
          companyId: selectedCompany.companyId,
          ...data,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        navigate("/reserve/company-journeys", {
          state: { journeys: response.data.journeys },
        });
      }
    } catch (error) {
      console.error("Error fetching journeys:", error.message);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600">
        <div className="w-full max-w-md p-8 text-center border shadow-2xl bg-white/20 backdrop-blur-lg rounded-2xl border-white/30">
          <h2 className="mb-6 text-3xl font-bold text-white drop-shadow-lg">
            اختر الشركة
          </h2>

          {Array.isArray(companies) && companies.length > 0 ? (
            <>
              {/* Select dropdown */}
              <select
                className="w-full p-3 mb-5 text-lg text-gray-800 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
                value={selectedCompany?.companyId || ""}
                onChange={(e) =>
                  setSelectedCompany(
                    companies.find((c) => c.companyId === e.target.value)
                  )
                }
              >
                {companies.map((company, index) => (
                  <option
                    key={index}
                    value={company.companyId}
                    className="text-gray-800"
                  >
                    {company.companyName}
                  </option>
                ))}
              </select>

              {/* Button */}
              <button
                className="w-full px-6 py-3 text-lg font-semibold text-white transition transform shadow-lg rounded-xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:scale-105 hover:from-yellow-500 hover:via-red-500 hover:to-pink-500 disabled:opacity-50"
                onClick={handleShowJourneys}
                disabled={!selectedCompany}
              >
                عرض الرحلات للشركة المختارة
              </button>

              {/* Selected info */}
              {selectedCompany && (
                <div className="px-4 py-2 mt-4 text-lg text-gray-900 rounded-lg shadow-sm bg-white/70">
                  الشركة المختارة:{" "}
                  <span className="font-bold text-indigo-700">
                    {selectedCompany.companyName}
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="p-4 text-lg font-medium text-red-600 rounded-lg shadow-md bg-white/70">
              <h3>لا توجد شركات للعرض</h3>
              <p className="text-gray-700">الرجاء العودة وإعادة البحث.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Companies;
