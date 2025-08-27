import express from "express";
import verifyToken from "../middlwaers/verfiy.js";
import { deleteReservation, getCompanyJourneys, getJourneyById, getUserReservations, makeReserv, searchJourney } from "../controllers/customerController.js";


const customerRouter = express.Router();

customerRouter.post('/search',verifyToken,searchJourney)

customerRouter.post('/company-journeys',verifyToken,getCompanyJourneys)

customerRouter.get('/company-journeys/:id',verifyToken,getJourneyById)

customerRouter.post('/make-reserv',verifyToken,makeReserv)

customerRouter.get('/my-reserv',verifyToken,getUserReservations)

customerRouter.delete('/my-reserv/:reservationId',verifyToken,deleteReservation)

export default customerRouter;



