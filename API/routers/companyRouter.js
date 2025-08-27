import express from 'express';
import {
  addJourney,
  getAllJourneysForCompany,
  deleteJourney,
  updateJourney,
  getJourneyDetails,
  removeUserFromJourney
} from '../controllers/companeyController.js';
import verifyToken from '../middlwaers/verfiy.js';

const comRouter = express.Router();

// ✅ Check if user is a company
comRouter.get("/isCompaney", verifyToken, (req, res) => {
  try {
    
    if (req.user.isCompany) {
      return res.status(200).json({ isCompaney: true });
    } else {
      return res.status(200).json({ isCompaney: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "حدث خطأ أثناء التحقق من صلاحيات الشركة",
      error,
    });
  }
});

// ✅ Create a new journey
comRouter.post('/add', verifyToken, addJourney);

// ✅ Get all journeys for the logged-in company
comRouter.get('/journeys', verifyToken, getAllJourneysForCompany);

// ✅ Delete a specific journey by ID
comRouter.delete('/journey/:id', verifyToken, deleteJourney);

// ✅ Update a specific journey by ID
comRouter.put('/journeys/:id', verifyToken, updateJourney);


comRouter.get('/journey/:id', verifyToken, getJourneyDetails);

comRouter.patch('/journey-seat/:id', verifyToken, removeUserFromJourney);


export default comRouter;
