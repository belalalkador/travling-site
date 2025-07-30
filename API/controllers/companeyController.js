import Journey from "../models/JournyModel.js";

// GET all journeys for the logged-in company
export const getAllJourneysForCompany = async (req, res) => {
  try {
    if (!req.user.isCompany) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const companyId = req.user.userId;
    const journeys = await Journey.find({ companyId: companyId });

    res.status(200).json({ message: "Journeys retrieved successfully", journeys });
  } catch (error) {
    console.error("Error fetching journeys:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ADD a new journey
export const addJourney = async (req, res) => {
  try {
    // Check if the user is a company
    if (!req.user.isCompany) {
      return res.status(403).json({ message: "Unauthorized to create journey" });
    }

    // Extract data from the request body
    const {
      NumOfTrip,
      timeOfTrip,
      timeToReach,
      destination_from,
      destination_to,
      busType,
      totalSeats,
      price,
      timeOfDay, // New field for time of the day
    } = req.body;

    console.log(NumOfTrip);

    // Check if a journey with the same number already exists
    const existing = await Journey.findOne({ NumOfTrip });
    if (existing) {
      return res.status(400).json({ message: "Journey number already exists" });
    }

    // Create the seats array
    const seats = Array.from({ length: totalSeats }, (_, index) => ({
      seatId: index + 1,
      status: "available",
      user: null,
    }));

    // Create the new journey object with the additional fields
    const newJourney = new Journey({
      NumOfTrip,
      companyId: req.user.userId, // Company ID from the authenticated user
      timeOfTrip,
      timeToReach,
      destination_from,
      destination_to,
      busType,
      totalSeats,
      seats,
      price, // Added price
      timeOfDay, // Added time of day
    });

    // Save the new journey to the database
    await newJourney.save();

    // Return a success response
    res.status(201).json({
      success: true,
      message: "Journey created successfully",
      journey: newJourney,
    });
  } catch (error) {
    console.error("Error creating journey:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
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

    await Journey.findByIdAndDelete(id);

    res.status(200).json({ message: "Journey deleted successfully" });
  } catch (error) {
    console.error("Error deleting journey:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// UPDATE a journey by ID (with ownership check)
export const updateJourney = async (req, res) => {
  try {
    if (!req.user.isCompaney) {
      return res.status(403).json({ message: "Unauthorized to update journey" });
    }

    const { id } = req.params;
    const updates = req.body;

    const journey = await Journey.findById(id);
    if (!journey || journey.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized or journey not found" });
    }

    const updatedJourney = await Journey.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: "Journey updated successfully", journey: updatedJourney });
  } catch (error) {
    console.error("Error updating journey:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
