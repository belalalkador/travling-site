import React, { useState } from 'react';
import axios from 'axios';
import './Search.css';
import { Layout } from '../../../Layout/Layout';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const navigate = useNavigate();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [timeOfTrip, setTimeOfTrip] = useState('');
  const [price, setPrice] = useState('');

  // Syrian cities list
  const syrianCities = [
    'دمشق', 'حلب', 'حمص', 'حماة', 'اللاذقية', 'طرطوس', 
    'دير الزور', 'الحسكة', 'الرقة', 'السويداء', 'درعا',
    'إدلب', 'القنيطرة', 'ريف دمشق'
  ];

const handleSearch = async () => {
  try {
    // Validate required fields
    if (!from || !to || from===to) {
      alert("الرجاء اختيار مدينتي المغادرة والوصول");
      return;
    }

    const response = await axios.post(
      'http://localhost:3000/customer/api/v1/search',
      {
        destination_from: from,
        destination_to: to,
        timeOfDay: timeOfTrip,
        price,
      },
      {
        withCredentials: true,
      }
    );

    if (response.data.success) {
      if (response.data.companies.length === 0) {
        alert("لا توجد رحلات متاحة للبحث المطلوب");
      } else {
        navigate('/reserve/companies', { 
          state: {
            companies: response.data.companies,
            data: {
              destination_from: from,
              destination_to: to,
              timeOfDay: timeOfTrip,
              price,
            }
          } 
        });
      }
    } else {
      alert("حدث خطأ في البحث، الرجاء المحاولة لاحقاً");
    }
  } catch (err) {
    console.error('فشل في البحث:', err.message);
    alert("فشل في الاتصال بالخادم، الرجاء التحقق من اتصال الإنترنت");
  }
};

  return (
    <Layout>
      <div className="search-container">
        <div className="search-form">
          <h2>ابحث عن الرحلة</h2>
          
          {/* From City Select */}
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            required
          >
            <option value="">اختر مدينة المغادرة</option>
            {syrianCities.map(city => (
              <option key={`from-${city}`} value={city}>
                {city}
              </option>
            ))}
          </select>

          {/* To City Select */}
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
          >
            <option value="">اختر مدينة الوصول</option>
            {syrianCities.map(city => (
              <option key={`to-${city}`} value={city}>
                {city}
              </option>
            ))}
          </select>

          {/* Time Selection */}
          <select
            value={timeOfTrip}
            onChange={(e) => setTimeOfTrip(e.target.value)}
          >
            <option value="">اختر الوقت</option>
            <option value="before_noon">قبل 12ظهرا</option>
            <option value="afternoon">بعد 12ظهرا</option>
            <option value="evening"> بعد 6 مساء</option>
          </select>

          {/* Price Input */}
          <input
            type="number"
            placeholder="السعر (اختياري)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="0"
          />

          <button onClick={handleSearch}>بحث</button>
        </div>
      </div>
    </Layout>
  );
};

export default Search;