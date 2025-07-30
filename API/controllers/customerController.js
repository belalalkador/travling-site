import Journey from "../models/JournyModel.js";
import User from "../models/userModel.js";
import Reservation from '../models/reserve.js'
import mongoose from "mongoose";

export const searchJourney = async (req,res) => {
  try {
    const { destination_from,destination_to,timeOfDay,price } = req.body;

    let query = {};

    if (destination_from) {
      query.destination_from = { $regex: destination_from,$options: "i" };
    }

    if (destination_to) {
      query.destination_to = { $regex: destination_to,$options: "i" };
    }

    if (timeOfDay) {
      query.timeOfDay = timeOfDay;
    }

    if (price) {
      query.price = { $lte: price };
    }

    if (Object.keys(query).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one filter to search.",
      });
    }

    // Find matching journeys
    const journeys = await Journey.find(query).select('companyId');

    if (journeys.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No journeys found matching your criteria",
      });
    }

    // Extract unique company IDs
    const companyIds = [...new Set(journeys.map(j => j.companyId.toString()))];

    // Find companies with IDs and names
    const companies = await User.find({ _id: { $in: companyIds } }).select('name');

    // Map to objects: { companyId, companyName }
    const companyList = companies.map(company => ({
      companyId: company._id,
      companyName: company.name
    }));

    return res.status(200).json({ success: true,companies: companyList });
  } catch (error) {
    console.error("Error searching journeys:",error);
    return res.status(500).json({ success: false,message: "Server error",error: error.message });
  }
};

export const getCompanyJourneys = async (req,res) => {
  try {
    const { destination_from,destination_to,timeOfDay,companyId } = req.body;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID is required",
      });
    }

    const query = {
      companyId, // exact match for ObjectId
    };

    if (destination_from) {
      query.destination_from = { $regex: destination_from,$options: 'i' };
    }

    if (destination_to) {
      query.destination_to = { $regex: destination_to,$options: 'i' };
    }

    if (timeOfDay) {
      query.timeOfDay = timeOfDay;
    }

    const journeys = await Journey.find(query).select('-seats -busType');

    if (journeys.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No journeys found for the selected company and filters",
      });
    }

    res.status(200).json({ success: true,journeys });

  } catch (error) {
    console.error("Error fetching company journeys:",error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getJourneyById = async (req, res) => {
  try {
    const { id } = req.params;

    const journey = await Journey.findById(id).lean();

    if (!journey) {
      return res.status(404).json({
        success: false,
        message: 'Journey not found',
      });
    }

    // Extract booked seats
    const bookedSeats = journey.seats
      .filter(seat => seat.status === 'booked')
      .map(seat => seat.seatId);

    res.status(200).json({
      success: true,
      journey: {
        ...journey,
        bookedSeats
      }
    });
  } catch (error) {
    console.error('Error fetching journey by ID:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const makeReserv = async (req,res) => {
  const { userId,journeyId,seatId,name,phone,age,email } = req.body;

  try {
    const journey = await Journey.findById(journeyId);
    if (!journey) return res.status(404).json({ message: 'Journey not found' });

    const seatIndex = parseInt(seatId); // ensure it's a number if seatId is string
    const seat = journey.seats[seatIndex];

    if (!seat) return res.status(404).json({ message: 'Seat not found' });
    if (seat.status === 'booked') return res.status(400).json({ message: 'Seat already booked' });

    // Add full booking data to the seat
    seat.status = 'booked';
    seat.user = userId;
    seat.name = name;
    seat.phone = phone;
    seat.age = age;
    seat.email = email;
    seat.date = new Date();

    await journey.save();

    const reservation = await Reservation.create({
      journeyId,
      userId,
      seatId: seatId.toString(), // storing seatId as string

    });


    return res.status(201).json({
      success: true,
      message: 'Reservation successful',
      reservation,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error',error: error.message });
  }
};

export const getUserReservations = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    // Get reservations with populated journey details
    const reservations = await Reservation.find({ userId })
      .populate({
        path: 'journeyId',
        select: 'destination_from destination_to timeOfTrip busType price status',
        model: Journey
      })
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination metadata
    const total = await Reservation.countDocuments({ userId });

    if (!reservations.length) {
      return res.status(200).json({
        success: true,
        message: 'No reservations found for this user',
        data: [],
        meta: { total, page, limit, pages: Math.ceil(total / limit) }
      });
    }

    // Transform data for cleaner client response
    const formattedReservations = reservations.map(res => ({
      _id: res._id,
      seatId: res.seatId,
      createdAt: res.createdAt,
      journey: {
        _id: res.journeyId._id,
        from: res.journeyId.destination_from,
        to: res.journeyId.destination_to,
        departure: res.journeyId.timeOfTrip,
        busType: res.journeyId.busType,
        price: res.journeyId.price,
        status: res.journeyId.status
      }
    }));

    res.status(200).json({
      success: true,
      data: formattedReservations,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error(`[Reservation Controller Error] ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reservations',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};





