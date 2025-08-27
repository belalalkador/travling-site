import Notification from "../models/notificationModel.js"
import { io,getSocketId } from "../socket/socket.js";
import Reservation from '../models/reserve.js'
import Journey from '../models/JournyModel.js'
// GET all journeys for the logged-in company
export const getAllJourneysForCompany = async (req, res) => {
  try {
    if (!req.user.isCompany) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const companyId = req.user.userId;
    const journeys = await Journey.find({ companyId: companyId });

    res
      .status(200)
      .json({ message: "Journeys retrieved successfully", journeys });
  } catch (error) {
    console.error("Error fetching journeys:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addJourney = async (req, res) => {
  try {
    // Only companies can add journeys
    if (!req.user || !req.user.isCompany) {
      return res.status(403).json({
        success: false,
        message: "غير مسموح: فقط حسابات الشركات يمكنها إضافة رحلات.",
      });
    }

    let {
      NumOfTrip,
      destination_from,
      destination_to,
      busType,
      totalSeats,
      price,
      timeOfDay,
      departureTime,
      arrivalTime,
      isDaily,
      daysOfWeek,
    } = req.body;

    const NumOfTripNum = Number(NumOfTrip);
    const totalSeatsNum = parseInt(totalSeats, 10);
    const priceNum = Number(price);

    // Basic validations
    if (!NumOfTrip || isNaN(NumOfTripNum) || NumOfTripNum < 1)
      return res.status(400).json({ success: false, message: "رقم الرحلة (NumOfTrip) مطلوب ويجب أن يكون رقمًا صحيحًا >= 1." });

    if (!destination_from || !destination_to)
      return res.status(400).json({ success: false, message: "يجب تحديد مدينتي الانطلاق والوصول." });

    if (destination_from === destination_to)
      return res.status(400).json({ success: false, message: "مدينة الانطلاق ومدينة الوصول يجب أن تكونا مختلفتين." });

    if (!busType) return res.status(400).json({ success: false, message: "نوع الحافلة (busType) مطلوب." });

    if (isNaN(totalSeatsNum) || totalSeatsNum <= 0)
      return res.status(400).json({ success: false, message: "عدد المقاعد (totalSeats) يجب أن يكون رقمًا صحيحًا أكبر من الصفر." });

    if (isNaN(priceNum))
      return res.status(400).json({ success: false, message: "السعر (price) يجب أن يكون رقمًا." });

    // isDaily flag
    const isDailyFlag = typeof isDaily === "string"
      ? ["true", "1", "yes", "on"].includes(isDaily.toLowerCase())
      : Boolean(isDaily);

    // Normalize days of week
    const enToArDays = { sunday: "الأحد", monday: "الاثنين", tuesday: "الثلاثاء", wednesday: "الأربعاء", thursday: "الخميس", friday: "الجمعة", saturday: "السبت" };
    const validArDays = Object.values(enToArDays);

    const normalizeDays = (input) => {
      if (!input) return [];
      let arr = Array.isArray(input) ? input : String(input).split(",").map(s => s.trim()).filter(Boolean);
      return arr.map(d => enToArDays[d.toLowerCase()] || d.trim()).filter(d => validArDays.includes(d));
    };
    const days = normalizeDays(daysOfWeek);

    // Map timeOfDay
    const todMap = { before_noon: "قبل الظهر", afternoon: "بعد الظهر", evening: "المساء", "قبل الظهر": "قبل الظهر", "بعد الظهر": "بعد الظهر", "المساء": "المساء" };
    const mappedTOD = todMap[String(timeOfDay).toLowerCase()] || todMap[timeOfDay];
    if (!mappedTOD) return res.status(400).json({ success: false, message: "timeOfDay غير صالح." });
    timeOfDay = mappedTOD;

    // Validate departureTime & arrivalTime
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if ((isDailyFlag || days.length) && !departureTime) return res.status(400).json({ success: false, message: "حقل 'وقت الانطلاق' مطلوب." });
    if (departureTime && !timeRegex.test(departureTime)) return res.status(400).json({ success: false, message: "صيغة 'وقت الانطلاق' يجب أن تكون HH:mm." });
    if (arrivalTime && !timeRegex.test(arrivalTime)) return res.status(400).json({ success: false, message: "صيغة 'وقت الوصول' يجب أن تكون HH:mm." });

    // Check duplicate per company
    const existing = await Journey.findOne({ companyId: req.user.userId, NumOfTrip: NumOfTripNum });
    if (existing) return res.status(400).json({ success: false, message: "يوجد رحلة بنفس رقم الرحلة (NumOfTrip) بالفعل للشركة الحالية." });

    // Create seats array
    const seats = Array.from({ length: totalSeatsNum }, (_, index) => ({
      seatId: index + 1, status: "available", user: null, name: null, phone: null, age: null, email: null, date: Date.now()
    }));

    const newJourney = new Journey({
      NumOfTrip: NumOfTripNum,
      companyId: req.user.userId,
      departureTime,
      arrivalTime,
      isDaily: isDailyFlag,
      daysOfWeek: days,
      destination_from,
      destination_to,
      busType,
      totalSeats: totalSeatsNum,
      seats,
      price: priceNum,
      timeOfDay,
    });

    await newJourney.save();

    return res.status(201).json({ success: true, message: "تم إنشاء الرحلة بنجاح.", journey: newJourney });

  } catch (error) {
    console.error("Error creating journey:", error);
    return res.status(500).json({ success: false, message: "خطأ في الخادم أثناء إنشاء الرحلة.", error: error.message });
  }
};


export const deleteJourney = async (req, res) => {
  try {
    if (!req.user.isCompany) {
      return res.status(403).json({ message: "Unauthorized to delete journey" });
    }

    const { id } = req.params;
    const journey = await Journey.findById(id);
    if (!journey || journey.companyId.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: "Unauthorized or journey not found" });
    }

    // 1. Find all reservations for this journey
    const reservations = await Reservation.find({ journeyId: id });

    // 2. Notify each user
    for (const reservation of reservations) {
      const message = `Your reservation (Seat ${reservation.seatId}) on journey from ${journey.destination_from} → ${journey.destination_to} has been cancelled.`;

      // Save notification in DB
      const notification = await Notification.create({
        message,
        userId: reservation.userId,
        companyId: req.user.userId
      });

      // Emit real-time notification if user is connected
      const socketId = getSocketId(reservation.userId.toString());
      if (socketId && io.sockets.sockets.get(socketId)) {
        io.to(socketId).emit("newNotification", notification);
      }
    }

    // 3. Delete the journey
    await Journey.findByIdAndDelete(id);

    res.status(200).json({ message: "Journey deleted successfully and users notified" });
  } catch (error) {
    console.error("Error deleting journey:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};;

export const updateJourney = async (req, res) => {
  try {
    // تحقق أن المستخدم شركة
    if (!req.user || !req.user.isCompany) {
      return res
        .status(403)
        .json({
          success: false,
          message: "غير مسموح: فقط حسابات الشركات يمكنها تعديل رحلات.",
        });
    }

    const { id } = req.params;
    const updates = { ...req.body };

    // العثور على الرحلة
    const journey = await Journey.findById(id);
    if (!journey) {
      return res
        .status(404)
        .json({ success: false, message: "لم يتم العثور على الرحلة." });
    }

    // تحقق أن الرحلة تخص نفس الشركة
    if (journey.companyId.toString() !== req.user.userId.toString()) {
      return res
        .status(403)
        .json({
          success: false,
          message: "غير مسموح: هذه الرحلة لا تخص حسابك.",
        });
    }

    // --- نفس التحقق/التطبيع كما في addJourney ---

    // رقم الرحلة
    if (updates.NumOfTrip !== undefined) {
      const NumOfTripNum = Number(updates.NumOfTrip);
      if (isNaN(NumOfTripNum) || NumOfTripNum < 1) {
        return res
          .status(400)
          .json({
            success: false,
            message: "NumOfTrip يجب أن يكون رقمًا صحيحًا >= 1.",
          });
      }
      // تأكد من عدم وجود رحلة بنفس الرقم (باستثناء الرحلة الحالية)
      const existing = await Journey.findOne({
        NumOfTrip: NumOfTripNum,
        _id: { $ne: id },
      });
      if (existing) {
        return res
          .status(400)
          .json({
            success: false,
            message: "يوجد رحلة أخرى بنفس رقم الرحلة (NumOfTrip).",
          });
      }
      updates.NumOfTrip = NumOfTripNum;
    }

    // مدن الانطلاق والوصول
    if (updates.destination_from && updates.destination_to) {
      if (updates.destination_from === updates.destination_to) {
        return res
          .status(400)
          .json({
            success: false,
            message: "مدينة الانطلاق ومدينة الوصول يجب أن تكونا مختلفتين.",
          });
      }
    }

    // المقاعد والسعر
    if (updates.totalSeats !== undefined) {
      const totalSeatsNum = parseInt(updates.totalSeats, 10);
      if (isNaN(totalSeatsNum) || totalSeatsNum <= 0) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "عدد المقاعد (totalSeats) يجب أن يكون رقمًا صحيحًا أكبر من الصفر.",
          });
      }
      updates.totalSeats = totalSeatsNum;

      // إذا تم تغيير عدد المقاعد، أنشئ مقاعد جديدة
      updates.seats = Array.from({ length: totalSeatsNum }, (_, index) => ({
        seatId: index + 1,
        status: "available",
        user: null,
        name: null,
        phone: null,
        age: null,
        email: null,
        date: Date.now(),
      }));
    }

    if (updates.price !== undefined) {
      const priceNum = Number(updates.price);
      if (isNaN(priceNum)) {
        return res
          .status(400)
          .json({
            success: false,
            message: "السعر (price) يجب أن يكون رقمًا.",
          });
      }
      updates.price = priceNum;
    }

    // isDaily
    if (updates.isDaily !== undefined) {
      updates.isDaily =
        typeof updates.isDaily === "string"
          ? ["true", "1", "yes", "on"].includes(updates.isDaily.toLowerCase())
          : Boolean(updates.isDaily);
    }

    // daysOfWeek
    if (updates.daysOfWeek !== undefined) {
      const enToArDays = {
        sunday: "الأحد",
        monday: "الاثنين",
        tuesday: "الثلاثاء",
        wednesday: "الأربعاء",
        thursday: "الخميس",
        friday: "الجمعة",
        saturday: "السبت",
      };
      const validArDays = [
        "الأحد",
        "الاثنين",
        "الثلاثاء",
        "الأربعاء",
        "الخميس",
        "الجمعة",
        "السبت",
      ];
      const normalizeDays = (input) => {
        if (!input) return [];
        let arr = Array.isArray(input)
          ? input
          : String(input)
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
        const normalized = arr.map((d) => {
          const lower = d.toLowerCase();
          if (enToArDays[lower]) return enToArDays[lower];
          return d.trim();
        });
        return normalized.filter((d) => validArDays.includes(d));
      };
      updates.daysOfWeek = normalizeDays(updates.daysOfWeek);
    }

    // timeOfDay
    if (updates.timeOfDay !== undefined) {
      const todMap = {
        before_noon: "قبل الظهر",
        afternoon: "بعد الظهر",
        evening: "المساء",
        "قبل الظهر": "قبل الظهر",
        "بعد الظهر": "بعد الظهر",
        المساء: "المساء",
      };
      const todKey = String(updates.timeOfDay);
      const mappedTOD = todMap[todKey.toLowerCase()] || todMap[todKey];
      if (!mappedTOD) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "timeOfDay يجب أن تكون واحدة من: before_noon, afternoon, evening أو قيمتها العربية.",
          });
      }
      updates.timeOfDay = mappedTOD;
    }

    // departureTime & arrivalTime
    if (updates.departureTime || updates.arrivalTime) {
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      if (updates.departureTime && !timeRegex.test(updates.departureTime)) {
        return res
          .status(400)
          .json({
            success: false,
            message: "صيغة departureTime يجب أن تكون HH:mm.",
          });
      }
      if (updates.arrivalTime && !timeRegex.test(updates.arrivalTime)) {
        return res
          .status(400)
          .json({
            success: false,
            message: "صيغة arrivalTime يجب أن تكون HH:mm.",
          });
      }
    }

    // تحديث الرحلة
    const updatedJourney = await Journey.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "تم تحديث الرحلة بنجاح.",
      journey: updatedJourney,
    });
  } catch (error) {
    console.error("Error updating journey:", error);
    res.status(500).json({
      success: false,
      message: "خطأ في الخادم أثناء تحديث الرحلة.",
      error: error.message,
    });
  }
};

export const getJourneyDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Find journey by ID and populate seat.user (just name + email)
    const journey = await Journey.findById(id).populate(
      "seats.user",
      "name email"
    );

    if (!journey) {
      return res
        .status(404)
        .json({ success: false, message: "Journey not found" });
    }

    // Extract only booked users info (name, email, seatId, etc.)
    const bookedSeats = journey.seats
      .filter((seat) => seat.status === "booked" && seat.user)
      .map((seat) => ({
        seatId: seat.seatId,
        name: seat.name || seat.user?.name,
        email: seat.email || seat.user?.email,
        phone: seat.phone,
        age: seat.age,
      }));

    res.json({
      success: true,
      journey,
      passengers: bookedSeats,
    });
  } catch (error) {
    console.error("Error fetching journey details:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};


export const removeUserFromJourney = async (req, res) => {
  try {
    const journeyId = req.params.id;
    const { seatIndex } = req.body; 
    
    const journey = await Journey.findById(journeyId);
    if (!journey) {
      return res
      .status(404)
      .json({ success: false, message: "Journey not found" });
    }
    
    // Validate seatIndex
    if (seatIndex < 0 || seatIndex >= journey.seats.length) {
      return res
      .status(400)
      .json({ success: false, message: "Invalid seat index" });
    }
    
    const seat = journey.seats[seatIndex];
    
    if (!seat.user) {
      return res
      .status(404)
      .json({ success: false, message: "No user booked this seat" });
    }
    
    const userId = seat.user.toString();
    const seatId = seat._id?.toString() || seatIndex.toString(); // use seat._id if exists
    
    // Reset seat to available
    seat.status = "available";
    seat.user = null;
    seat.name = null;
    seat.email = null;
    seat.phone = null;
    seat.age = null;
    
    await journey.save();
    
    console.log(journeyId,userId,seatId)
    console.log("I am here")

 const rev =   await Reservation.findOneAndDelete({
      journeyId,
      userId,
   seatId: (seatIndex + 1).toString()
    });


    const message = `You have been removed from the journey from ${journey.destination_from} → ${journey.destination_to}.`;

    const notification = await Notification.create({
      message,
      userId,
      companyId: journey.companyId, // assuming journey has companyId
    });

    // Emit real-time notification if the user is connected
    const socketId = getSocketId(userId);
    console.log(socketId)
    if (socketId && io.sockets.sockets.get(socketId)) {
      console.log("hello")
        io.to(socketId).emit("newNotification", notification);
    }

    res.json({
      success: true,
      message: "User removed from journey successfully, reservation deleted, and user notified",
      journey,
    });
  } catch (error) {
    console.error("Error removing user from journey:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
