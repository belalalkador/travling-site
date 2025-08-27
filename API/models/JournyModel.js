import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
  seatId: { type: Number, required: true },
  status: { type: String, enum: ['available', 'booked'], default: 'available' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  name: { type: String, default: null, trim: true },
  phone: { type: String, trim: true },
  age: { type: Number },
  email: { type: String, trim: true, lowercase: true },
  date: { type: Date, default: Date.now }
}, { _id: false });

// قائمة الأيام باللغة العربية
const WEEKDAY_ENUM = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];

const journeySchema = new mongoose.Schema({
 
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    NumOfTrip: { type: Number,required:true },
  // رحلة محددة بتاريخ ووقت كامل (حالة رحلة منفردة)
  timeOfTrip: { type: Date },

  // وقت الانطلاق بالساعة والدقيقة بصيغة "HH:mm" للاستخدام في الرحلات المتكررة
  departureTime: {
    type: String,
    validate: {
      validator: v => /^([01]\d|2[0-3]):([0-5]\d)$/.test(v),
      message: props => `${props.value} ليس وقتًا صالحًا بصيغة HH:mm`
    },
    required: function() { return !!(this.isDaily || (this.daysOfWeek && this.daysOfWeek.length)); }
  },

  // وقت الوصول الاختياري بصيغة "HH:mm"
  arrivalTime: {
    type: String,
    validate: {
      validator: v => !v || /^([01]\d|2[0-3]):([0-5]\d)$/.test(v),
      message: props => `${props.value} ليس وقتًا صالحًا بصيغة HH:mm`
    }
  },

  // هل تعمل الرحلة كل يوم؟
  isDaily: { type: Boolean, default: false },

  // أيام الأسبوع التي تعمل بها الرحلة (قائمة أسماء بالأحرف العربية)
  daysOfWeek: {
    type: [{ type: String, enum: WEEKDAY_ENUM }],
    default: []
  },

  destination_from: { type: String, required: true },
  destination_to: { type: String, required: true },
  busType: { type: String, enum: ['1x2x3', '2x2x3', '2x2x2', '2x1x3'], required: true },
  totalSeats: { type: Number, required: true },
  seats: { type: [seatSchema], default: [] },
  status: { type: String, enum: ['active', 'completed', 'canceled'], default: 'active' },
  price: { type: Number, required: true },

  // قيم وقت اليوم مكتوبة بالعربية
  timeOfDay: { type: String, enum: ['قبل الظهر', 'بعد الظهر', 'المساء'], required: true }

}, { timestamps: true });

// دالة عبر الinstance لفحص إن كانت الرحلة تظهر لتاريخ معيّن
journeySchema.methods.isAvailableOn = function(date) {
  if (this.status !== 'active') return false;

  // لو كانت رحلة مرة واحدة بتاريخ كامل (timeOfTrip)
  if (this.timeOfTrip) {
    const a = new Date(this.timeOfTrip);
    const b = new Date(date);
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth() === b.getMonth() &&
           a.getDate() === b.getDate();
  }

  // قواعد التكرار:
  if (this.isDaily) return true;

  if (Array.isArray(this.daysOfWeek) && this.daysOfWeek.length) {
    const weekdayNamesArabic = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
    const todayName = weekdayNamesArabic[date.getDay()];
    return this.daysOfWeek.includes(todayName);
  }

  return false;
};
journeySchema.index({ companyId: 1, NumOfTrip: 1 }, { unique: true });
const Journey = mongoose.model("Journey", journeySchema);

export default Journey;
