import Journey from "../models/JournyModel.js";
import User from "../models/userModel.js";
import Reservation from '../models/reserve.js'

export const searchJourney = async (req, res) => {
  try {
    const { destination_from, destination_to, timeOfDay, price } = req.body;

    const query = {};
    if (destination_from) query.destination_from = { $regex: destination_from, $options: "i" };
    if (destination_to) query.destination_to = { $regex: destination_to, $options: "i" };
    if (timeOfDay) query.timeOfDay = timeOfDay;
    if (price !== undefined && price !== null && price !== "") query.price = { $lte: Number(price) };

    if (Object.keys(query).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one filter to search.",
      });
    }
  
    // Find matching journeys
    const journeys = await Journey.find(query).select("companyId destination_from destination_to price timeOfDay");

    if (!journeys.length) {
      return res.status(404).json({
        success: false,
        message: "No journeys found matching your criteria",
      });
    }
     console.log(journeys)
    // Extract unique company IDs
    const companyIds = [...new Set(journeys.map(j => j.companyId.toString()))];

    // Fetch company names
    const companies = await User.find({ _id: { $in: companyIds } }).select("name");

    // Map to { companyId, companyName }
    const companyList = companies.map(c => ({
      companyId: c._id,
      companyName: c.name,
    }));

    return res.status(200).json({
      success: true,
      companies: companyList,
      journeys: journeys, // optional: include journeys if needed
    });
  } catch (error) {
    console.error("Error searching journeys:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
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



const arabicWeekdaysMap = {
  "الأحد": 0,
  "الاحد": 0,
  "الإثنين": 1,
  "الاثنين": 1,
  "الثلاثاء": 2,
  "الأربعاء": 3,
  "الخميس": 4,
  "الجمعة": 5,
  "السبت": 6
};

export const getNextTripDate = (daysOfWeekArabic, departureTime) => {
  if (!daysOfWeekArabic || daysOfWeekArabic.length === 0 || !departureTime) return null;

  const now = new Date();
  const today = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const [depHour, depMin] = departureTime.split(":").map(Number);

  // Convert Arabic weekdays to JS day indexes
  const daysOfWeek = daysOfWeekArabic.map(d => arabicWeekdaysMap[d]);

  // Today's departure time
  const todayDeparture = new Date();
  todayDeparture.setHours(depHour, depMin, 0, 0);

  // If journey is today and not departed yet
  if (daysOfWeek.includes(today) && now < todayDeparture) {
    return todayDeparture;
  }

  // Find the next available day
  for (let i = 1; i <= 7; i++) {
    const nextDay = (today + i) % 7;
    if (daysOfWeek.includes(nextDay)) {
      const nextDate = new Date();
      nextDate.setDate(now.getDate() + i);
      nextDate.setHours(depHour, depMin, 0, 0);
      return nextDate;
    }
  }

  return null; // fallback
};


export const makeReserv = async (req, res) => {
  const {  journeyId, seatId, name, phone, age, email } = req.body;
  const userId= req.user.userId;

  try {
    // 1. Find journey
    const journey = await Journey.findById(journeyId);
    if (!journey)
      return res.status(404).json({ message: "Journey not found" });

    // 2. Validate seat
    const seatIndex = parseInt(seatId - 1);
    const seat = journey.seats[seatIndex];
    if (!seat) return res.status(404).json({ message: "Seat not found" });
    if (seat.status === "booked")
      return res.status(400).json({ message: "Seat already booked" });

    // 3. Calculate tripTime **before booking**
    let tripTime;
    const now = new Date();
    if (!journey.departureTime) {
      return res.status(400).json({ message: "Journey departureTime is missing" });
    }

    if (journey.isDaily) {
      const [depHour, depMin] = journey.departureTime.split(":").map(Number);
      let todayDeparture = new Date();
      todayDeparture.setHours(depHour, depMin, 0, 0);

      tripTime = now < todayDeparture
        ? todayDeparture
        : new Date(todayDeparture.setDate(todayDeparture.getDate() + 1));
    } else {
      if (!journey.daysOfWeek || journey.daysOfWeek.length === 0)
        return res.status(400).json({ message: "Journey daysOfWeek is missing" });

      tripTime = getNextTripDate(journey.daysOfWeek, journey.departureTime);
      if (!tripTime) {
        return res.status(400).json({ message: "Cannot calculate next trip date" });
      }
    }

    // 4. Reserve seat
    seat.status = "booked";
    seat.user = userId;
    seat.name = name;
    seat.phone = phone;
    seat.age = age;
    seat.email = email;
    seat.date = new Date();
    await journey.save();

    // 5. Create reservation
    const reservation = await Reservation.create({
      journeyId,
      userId,
      seatId: seatId.toString(),
      tripTime,
      isDone: false,
    });

    return res.status(201).json({
      success: true,
      message: "Reservation successful",
      reservation,
    });
  } catch (error) {
    console.error("Error in makeReserv:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};




export const getUserReservations = async (req, res) => {
  try {
    const  userId  =  req.user.userId;
    console.log(userId)
    const reservations = await Reservation.find({ userId })
      .populate({
        path: "journeyId",
        select:
          "NumOfTrip destination_from destination_to timeOfDay departureTime arrivalTime isDaily daysOfWeek  price status",
        model: Journey,
      })
      .sort({ createdAt: -1 }) 
    
     res.status(200).json({
      success: true,
      reservations
       });
  } catch (error) {
    console.error(`[Reservation Controller Error] ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reservations",
      });
  }
};


export const deleteReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;
     console.log(reservationId)
     console.log("reservationId")
    // 1. ابحث عن الحجز
    const reservation = await Reservation.findById(reservationId);
 
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // 2. تحقق من وقت الرحلة
    const now = new Date();
    if (new Date(reservation.tripTime) <= now) {
      return res.status(400).json({
        message: "Cannot delete, trip already started or passed",
      });
    }

    // 3. احذف الحجز
    await Reservation.findByIdAndDelete(reservationId);

    // 4. حرر المقعد من الرحلة
    const journey = await Journey.findById(reservation.journeyId);
    if (journey) {
      console.log("hello")
      const seat = journey.seats[reservation.seatId - 1];
      console.log(seat)
      if (seat) {
       seat.status = "available";
        seat.user = null;
        seat.name = null;
        seat.email = null;
        seat.phone = null;
        seat.age = null; // إرجاع المقعد كمتاح
        await journey.save();
      }
    }

    res.status(200).json({ message: "Reservation deleted successfully" });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



