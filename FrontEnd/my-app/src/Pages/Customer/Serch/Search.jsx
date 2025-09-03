import { useState } from "react";
import axios from "axios";
import { Layout } from "../../../Layout/Layout";
import { useNavigate } from "react-router-dom";
import bgImage from "../../../../src/assets/download\ \(9\).jfif"; // ✅ import background

const Search = () => {
  const navigate = useNavigate();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [timeOfTrip, setTimeOfTrip] = useState("");
  const [price, setPrice] = useState("");

  const syrianCities = [
    "دمشق",
    "حلب",
    "حمص",
    "حماة",
    "اللاذقية",
    "طرطوس",
    "دير الزور",
    "الحسكة",
    "الرقة",
    "السويداء",
    "درعا",
    "إدلب",
    "القنيطرة",
    "ريف دمشق",
  ];

 const handleSearch = async () => {
  try {
    if (!from || !to || from === to) {
      alert("الرجاء اختيار مدينتي المغادرة والوصول");
      return;
    }

    const response = await axios.post(
      "http://localhost:3000/customer/api/v1/search",
      {
        destination_from: from,
        destination_to: to,
        timeOfDay: timeOfTrip,
        price,
      },
      { withCredentials: true }
    );
    console.log(response.data)
    if (response.data.success) {
      if (response.data.companies.length === 0) {
        alert(`لا يوجد رحلات إلى ${to}`);
      } else {
        navigate("/reserve/companies", {
          state: {
            companies: response.data.companies,
            data: {
              destination_from: from,
              destination_to: to,
              timeOfDay: timeOfTrip,
              price,
            },
          },
        });
      }
    } else {
      alert("حدث خطأ في البحث، الرجاء المحاولة لاحقاً");
    }
  }  catch (err) {
  console.error("فشل في البحث:", err.message);

  // إذا كان الخطأ من axios (response موجود)
  if (err.response && err.response.status === 404) {
    alert("لم يتم العثور على نتائج");
  } else {
    // في حالة وجود رسالة خطأ أخرى
    alert(err.message || "حدث خطأ غير متوقع");
  }
}
}


  return (
    <Layout>
      <div
        className="flex items-center justify-center w-full h-screen overflow-hidden bg-center bg-cover"
        style={{ backgroundImage: `url("../../../../src/assets/download\ \(9\).jfif")` }}
      >
        <div className="w-[400px] p-10 rounded-2xl bg-white/15 shadow-2xl backdrop-blur-md border border-white/20 text-center text-white">
          <h2 className="mb-6 text-2xl font-semibold drop-shadow-lg">ابحث عن الرحلة</h2>

          {/* From City */}
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full p-3 mb-4 text-lg text-gray-800 border border-gray-300 rounded-lg bg-white/90 focus:ring-2 focus:ring-teal-400 focus:outline-none"
          >
            <option value="">اختر مدينة المغادرة</option>
            {syrianCities.map((city) => (
              <option key={`from-${city}`} value={city}>
                {city}
              </option>
            ))}
          </select>

          {/* To City */}
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full p-3 mb-4 text-lg text-gray-800 border border-gray-300 rounded-lg bg-white/90 focus:ring-2 focus:ring-teal-400 focus:outline-none"
          >
            <option value="">اختر مدينة الوصول</option>
            {syrianCities.map((city) => (
              <option key={`to-${city}`} value={city}>
                {city}
              </option>
            ))}
          </select>

          {/* Time */}
          <select
            value={timeOfTrip}
            onChange={(e) => setTimeOfTrip(e.target.value)}
            className="w-full p-3 mb-4 text-lg text-gray-800 border border-gray-300 rounded-lg bg-white/90 focus:ring-2 focus:ring-teal-400 focus:outline-none"
          >
            <option value="">اختر الوقت</option>
            <option value="قبل الظهر">قبل 12 ظهراً</option>
            <option value="بعد الظهر">بعد 12 ظهراً</option>
            <option value="المساء">بعد 6 مساءً</option>
          </select>



          {/* Button */}
          <button
            onClick={handleSearch}
            className="w-full py-3 text-lg font-semibold text-white transition transform shadow-lg rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:scale-105 hover:from-blue-500 hover:to-cyan-400"
          >
            بحث
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Search;
