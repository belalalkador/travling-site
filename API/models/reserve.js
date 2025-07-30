import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  journeyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Journey',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  seatId: {
    type: String, // Changed to String since it's not a reference
    required: true,
  },
 
 
}, {
  timestamps: true,
});

const Reservation = mongoose.model('Reservation', reservationSchema);
export default Reservation;
