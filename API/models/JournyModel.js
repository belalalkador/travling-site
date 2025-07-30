import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
  seatId: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['available', 'booked'],
    default: 'available',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to the user who booked the seat
    default: null,
  },
  name: {
    type: String,
    default: null,
    trim: true,
  },
  phone: {
    type: String,
      trim: true,
  },
  age: {
    type: Number,
   
  },
  email: {
    type: String,
      trim: true,
    lowercase: true,
  },
  date: {
    type: Date,
    default: Date.now,
  }
}, { _id: false }); // Prevents Mongoose from creating separate _id for each seat

// Journey schema
const journeySchema = new mongoose.Schema({
  NumOfTrip: {
    type: Number,
    required: true,
    unique: true,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  timeOfTrip: {
    type: Date,
    required: true,
  },
  timeToReach: {
    type: Date,
    required: true,
  },
  destination_from: {
    type: String,
    required: true,
  },
  destination_to: {
    type: String,
    required: true,
  },
  busType: {
    type: String,
    enum: ['1x2x3', '2x2x3', '2x2x2', '2x1x3'],
    required: true,
  },
  totalSeats: {
    type: Number,
    required: true,
  },
  seats: {
    type: [seatSchema],
    default: [],
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'canceled'],
    default: 'active',
  },
  price: {
    type: Number,
    required: true,  // Make sure the price is provided for each journey
  },
  timeOfDay: {
    type: String,
    enum: ['before_noon', 'afternoon', 'evening'],  // Define the possible time of day options
    required: true,  // This field must be filled when creating or updating a journey
  }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

const Journey = mongoose.model("Journey", journeySchema);

export default Journey;
