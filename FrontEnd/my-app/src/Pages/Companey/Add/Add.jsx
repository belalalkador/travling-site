import React, { useState } from 'react';
import axios from 'axios';

const syrianCities = [
  'دمشق', 'حلب', 'حمص', 'حماة', 'اللاذقية', 'طرطوس',
  'دير الزور', 'الحسكة', 'الرقة', 'السويداء', 'درعا',
  'إدلب', 'القنيطرة', 'ريف دمشق'
];

// أيام الأسبوع بالعربية (مطابقة لما يقبله السيرفر)
const WEEK_DAYS_AR = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];

const AddJourney = () => {
  const [formData, setFormData] = useState({
    NumOfTrip: '',
    // Removed datetime-local fields
    destination_from: '',
    destination_to: '',
    busType: '2x2x2',
    totalSeats: 40,
    price: '',
    timeOfDay: '',

    // الحقول الجديدة/المتبقية للدورة الزمنية
    isDaily: false,
    daysOfWeek: [],           // مصفوفة من الأسماء العربية
    departureTime: '',        // HH:mm (input type="time")
    arrivalTime: ''           // HH:mm اختياري
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
      // لو فعلنا isDaily نمسح daysOfWeek لأن الرحلة كل الأيام
      if (name === 'isDaily' && checked) {
        setFormData(prev => ({ ...prev, daysOfWeek: [] }));
      }
      setError('');
      setMessage('');
      return;
    }

    setFormData(prev => {
      // حقل أعداد يجب أن يصبح رقمياً
      if (['totalSeats', 'price', 'NumOfTrip'].includes(name)) {
        return { ...prev, [name]: value === '' ? '' : Number(value) };
      }
      return { ...prev, [name]: value };
    });
    setError('');
    setMessage('');
  };

  const toggleDay = day => {
    setFormData(prev => {
      const exists = prev.daysOfWeek.includes(day);
      const next = exists ? prev.daysOfWeek.filter(d => d !== day) : [...prev.daysOfWeek, day];
      return { ...prev, daysOfWeek: next };
    });
    setError('');
    setMessage('');
  };

  const validateForm = () => {
    const {
      NumOfTrip,
      destination_from,
      destination_to,
      isDaily,
      daysOfWeek,
      departureTime,
      price,
      totalSeats,
      timeOfDay
    } = formData;

    if (!NumOfTrip || Number(NumOfTrip) < 1) {
      return '⚠️ رقم الرحلة (NumOfTrip) مطلوب ويجب أن يكون 1 أو أكبر.';
    }

    if (!destination_from || !destination_to) {
      return '⚠️ يجب اختيار مدينتي الانطلاق والوصول.';
    }

    if (destination_from === destination_to) {
      return '⚠️ مدينة الانطلاق ومدينة الوصول يجب أن تكونا مختلفتين.';
    }

    if (!timeOfDay) {
      return '⚠️ الرجاء اختيار "فترة اليوم".';
    }

    if (!price || isNaN(Number(price))) {
      return '⚠️ الرجاء إدخال السعر صحيحاً.';
    }

    if (!totalSeats || Number(totalSeats) <= 0) {
      return '⚠️ الرجاء إدخال عدد مقاعد صحيح أكبر من الصفر.';
    }

    // بعد إزالة حقول الرحلة لمرة واحدة: نطلب جدولاً متكرراً (يومي أو أيام محددة)
    const isRecurring = Boolean(isDaily) || (Array.isArray(daysOfWeek) && daysOfWeek.length > 0);

    if (!isRecurring) {
      return '⚠️ يجب تحديد جدول الرحلة: فعّل "تعمل كل الأيام" أو اختر أياماً من "أيام الأسبوع". (تم إزالة خيار الرحلات لمرة واحدة في هذه الواجهة)';
    }

    // للرحلات المتكررة نحتاج departureTime بصيغة HH:mm
    if (!departureTime) {
      return '⚠️ للرحلات المتكررة يجب تحديد وقت الانطلاق (ساعة).';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      // جهّز الحمولة (payload) كما يتوقع الـ controller
      const payload = {
        NumOfTrip: Number(formData.NumOfTrip),

        // لحالات التكرار
        departureTime: formData.departureTime || undefined,
        arrivalTime: formData.arrivalTime || undefined,
        isDaily: !!formData.isDaily,
        daysOfWeek: formData.daysOfWeek && formData.daysOfWeek.length ? formData.daysOfWeek : undefined,

        destination_from: formData.destination_from,
        destination_to: formData.destination_to,
        busType: formData.busType,
        totalSeats: Number(formData.totalSeats),
        price: Number(formData.price),
        timeOfDay: formData.timeOfDay // السيرفر يتعامل مع القيم بالعربي أو الانجليزي
      };

      // احذف الحقول undefined لعدم إرسالها
      Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);

      const response = await axios.post(
        'http://localhost:3000/companey/api/v1/add',
        payload,
        { withCredentials: true }
      );

      if (response.data.success) {
        setMessage('✅ تم إضافة الرحلة بنجاح!');
        // إعادة تهيئة النموذج
        setFormData({
          NumOfTrip: '',
          destination_from: '',
          destination_to: '',
          busType: '2x2x2',
          totalSeats: 40,
          price: '',
          timeOfDay: '',
          isDaily: false,
          daysOfWeek: [],
          departureTime: '',
          arrivalTime: ''
        });
      } else {
        setError(response.data.message || '❌ حدث خطأ أثناء إضافة الرحلة.');
      }
    } catch (err) {
      setError(err.response?.data?.message || '❌ تعذر الاتصال بالخادم.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-8 bg-gradient-to-r from-cyan-700 via-blue-800 to-purple-900">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl p-8 space-y-6 text-white shadow-lg bg-white/10 backdrop-blur-md rounded-xl"
      >
        <h2 className="mb-4 text-4xl font-bold text-center">إضافة رحلة جديدة</h2>

        <div>
          <label className="block mb-2 font-semibold">رقم الرحلة (NumOfTrip)</label>
          <input
            type="number"
            name="NumOfTrip"
            value={formData.NumOfTrip}
            onChange={handleChange}
            required
            min={1}
            className="w-full px-5 py-3 placeholder-white border rounded-lg bg-white/20 border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            placeholder="أدخل رقم الرحلة"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block mb-2 font-semibold">من</label>
            <select
              name="destination_from"
              value={formData.destination_from}
              onChange={handleChange}
              required
              // force visible text/background when opening
              className="w-full px-5 py-3 text-black bg-white border rounded-lg border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              style={{ backgroundColor: 'white', color: '#000' }}
            >
              <option value="" disabled className="text-gray-500">اختر مدينة الانطلاق</option>
              {syrianCities.map((city, idx) => (
                <option key={idx} value={city} className="text-black">{city}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2 font-semibold">إلى</label>
            <select
              name="destination_to"
              value={formData.destination_to}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 text-black bg-white border rounded-lg border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              style={{ backgroundColor: 'white', color: '#000' }}
            >
              <option value="" disabled className="text-gray-500">اختر مدينة الوصول</option>
              {syrianCities.map((city, idx) => (
                <option key={idx} value={city} className="text-black">{city}</option>
              ))}
            </select>
          </div>
        </div>

        {/* خيارات الرحلات المتكررة */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <input
              id="isDaily"
              type="checkbox"
              name="isDaily"
              checked={formData.isDaily}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <label htmlFor="isDaily" className="font-semibold">تعمل كل الأيام (يوميًا)</label>
          </div>

          {!formData.isDaily && (
            <div>
              <label className="block mb-2 font-semibold">أيام الأسبوع (اختياري، فقط للرحلات المتكررة)</label>
              <div className="flex flex-wrap gap-2">
                {WEEK_DAYS_AR.map(day => {
                  const active = formData.daysOfWeek.includes(day);
                  return (
                    <button
                      type="button"
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-2 rounded-md border ${active ? 'bg-white/80 text-black' : 'bg-white/10 text-white'} `}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 mt-2 md:grid-cols-2">
            <div>
              <label className="block mb-2 font-semibold">وقت الانطلاق (ساعة)</label>
              <input
                type="time"
                name="departureTime"
                value={formData.departureTime}
                onChange={handleChange}
                className="w-full px-5 py-3 text-black bg-white border rounded-lg border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="HH:mm"
                style={{ backgroundColor: 'white', color: '#000' }}
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">وقت الوصول (ساعة - اختياري)</label>
              <input
                type="time"
                name="arrivalTime"
                value={formData.arrivalTime}
                onChange={handleChange}
                className="w-full px-5 py-3 text-black bg-white border rounded-lg border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="HH:mm"
                style={{ backgroundColor: 'white', color: '#000' }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
    

          <div>
            <label className="block mb-2 font-semibold">عدد المقاعد</label>
            <input
              type="number"
              name="totalSeats"
              value={formData.totalSeats}
              onChange={handleChange}
              required
              min={1}
              className="w-full px-5 py-3 border rounded-lg bg-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">السعر (ل.س)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 border rounded-lg bg-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 font-semibold">فترة اليوم</label>
          <select
            name="timeOfDay"
            value={formData.timeOfDay}
            onChange={handleChange}
            required
            className="w-full px-5 py-3 text-black bg-white border rounded-lg border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            style={{ backgroundColor: 'white', color: '#000' }}
          >
            <option value="" disabled className="text-gray-500">اختر الفترة</option>
            <option value="before_noon" className="text-black">قبل 12 الظهر</option>
            <option value="afternoon" className="text-black">بعد 12 الظهر</option>
            <option value="evening" className="text-black">بعد 6 مساء</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 mt-4 rounded-lg font-semibold transition ${
            loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-cyan-500 hover:bg-cyan-600'
          }`}
        >
          {loading ? '...جارٍ الإضافة' : 'إضافة الرحلة'}
        </button>

        {(error || message) && (
          <p
            className={`mt-6 text-center font-medium ${error ? 'text-red-400' : 'text-green-400'}`}
          >
            {error || message}
          </p>
        )}
      </form>
    </div>
  );
};

export default AddJourney;
