import express from "express";
import verifyToken from "../middlwaers/verfiy.js";
import { isAdmin } from "../middlwaers/isAdmin.js";
import {
  getAllUsers,
  deleteUser,
  makeCompaney,
  makeUnCompaney,
} from "../controllers/adminController.js";

const adminRouter = express.Router();

// Check if current user is admin
adminRouter.get("/isadmin", verifyToken, (req, res) => {
  try {
    if (req.user.isAdmin) {
      return res.status(200).json({ isAdmin: true });
    } else {
      return res.status(200).json({ isAdmin: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "حدث خطأ أثناء التحقق من صلاحيات المسؤول",
      error,
    });
  }
});

// GET all users
adminRouter.get("/users", verifyToken, isAdmin, getAllUsers);

// DELETE a user by ID
adminRouter.delete("/user/:id", verifyToken, isAdmin, deleteUser);

// Make user a company
adminRouter.put("/make-company/:id", verifyToken, isAdmin, makeCompaney);

// Make user not a company
adminRouter.put("/remove-company/:id", verifyToken, isAdmin, makeUnCompaney);

export default adminRouter;



