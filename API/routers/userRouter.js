import express from "express";

import {
  signup,
  login,
  logoutUser,
  updateUser,
  deleteUser,
  getUserInfo,
  markAsRead,
  deleteNotification,
} from "../controllers/userController.js";

import verifyToken from "../middlwaers/verfiy.js";

const userRouter = express.Router();

// تسجيل مستخدم جديد
userRouter.post("/signup",signup);

// تسجيل الدخول
userRouter.post("/login",login);

// تسجيل الخروج
userRouter.post("/logout",verifyToken,logoutUser);

// تحديث بيانات المستخدم (بدون تغيير كلمة المرور)
userRouter.put("/update",verifyToken,updateUser);

// حذف حساب المستخدم
userRouter.delete("/delete",verifyToken,deleteUser);

// جلب معلومات المستخدم (بدون كلمة المرور)
userRouter.get("/me",verifyToken,getUserInfo);

userRouter.put("/notification/:id",verifyToken,markAsRead);

userRouter.delete("/notification/:id",verifyToken,deleteNotification);



export default userRouter;
