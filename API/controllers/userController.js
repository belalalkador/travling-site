import User from "../models/userModel.js";
import { hashPassword,comparePassword } from "../utils/hash.js";
import jwt from "jsonwebtoken";
import Notification from '../models/notificationModel.js'

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const validateSignupInputs = (data) => {
  const { name,email,password,phone,birthday,sex } = data;
  if (!name) return "الاسم مطلوب";
  if (!email) return "البريد الإلكتروني مطلوب";
  if (!emailRegex.test(email)) return "البريد الإلكتروني غير صحيح";
  if (!password) return "كلمة المرور مطلوبة";
  if (!passwordRegex.test(password)) return "كلمة المرور يجب أن تحتوي على حرف كبير، حرف صغير، رقم، ورمز خاص";
  if (!phone) return "رقم الهاتف مطلوب";
  if (!birthday) return "تاريخ الميلاد مطلوب";
  if (!sex) return "الجنس مطلوب";
  return null;
};

// Helper function to validate login inputs
const validateLoginInputs = (data) => {
  const { email,password } = data;
  if (!email) return "البريد الإلكتروني مطلوب";
  if (!emailRegex.test(email)) return "البريد الإلكتروني غير صحيح";
  if (!password) return "كلمة المرور مطلوبة";
  return null;
};

// Signup function
export const signup = async (req,res) => {
  const { name,email,password,phone,birthday,sex } = req.body;

  const validationError = validateSignupInputs(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "البريد الإلكتروني مستخدم بالفعل" });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      birthday,
      sex,
    });

    await newUser.save();

    return res.status(201).json({ message: "تم إنشاء الحساب بنجاح",user: { userId: newUser._id,email: newUser.email } });
  } catch (error) {
    console.error("Error in signup:",error.message);
    return res.status(500).json({ message: "حدث خطأ أثناء عملية إنشاء الحساب",error: error.message });
  }
};

// Login function
export const login = async (req,res) => {
  const { email,password } = req.body;

  const validationError = validateLoginInputs(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

    const isMatch = await comparePassword(password,user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "كلمة المرور غير صحيحة" });
    }

    const payload = {
      userId: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin || false,
      isDriver: user.isDriver || false,
      isCompany: user.isCompany || false,
    };
console.log("bela");
    const accessToken = jwt.sign(payload,"belal_alkador_12345_some_text-moreText",{ expiresIn: "1h" });

    res.cookie("access_token",accessToken,{
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",  
      maxAge: 3600000 * 24 * 30,  
    });

    return res.status(200).json({
      message: "تم تسجيل الدخول بنجاح",
      user: payload,
    });
  } catch (error) {
    console.error("Error in login:",error.message);
    return res.status(500).json({ message: "حدث خطأ أثناء عملية تسجيل الدخول",error: error.message });
  }
};



export const updateUser = async (req, res) => {
  try {
    const userId = req.user.userId; // التحقق من المستخدم من خلال التوكن
    const { name, email, phone, birthday, sex } = req.body;

    // التحقق من صحة البيانات
    const validationError = validateSignupInputs({ name, email, phone, birthday, sex });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const updateData = { name, email, phone, birthday, sex };

    // التأكد أن البريد الإلكتروني غير مستخدم من قبل مستخدم آخر
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id.toString() !== userId) {
      return res.status(400).json({ message: "البريد الإلكتروني مستخدم بالفعل من قبل مستخدم آخر" });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

    return res.status(200).json({
      message: "تم تحديث الحساب بنجاح",
      user: {
        userId: updatedUser._id,
        email: updatedUser.email,
      },
    });

  } catch (error) {
    console.error("Error in updateUser:", error.message);
    return res.status(500).json({ message: "حدث خطأ أثناء تحديث الحساب", error: error.message });
  }
};

export const deleteUser = async (req,res) => {
  try {
    const userId = req.user.userId;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

    res.clearCookie("access_token");
    res.status(200).json({ message: "تم حذف الحساب بنجاح" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "حدث خطأ أثناء حذف الحساب",error });
  }
};

export const logoutUser = (req,res) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json({ message: "تم تسجيل الخروج بنجاح" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "حدث خطأ أثناء تسجيل الخروج",error });
  }
};

// controllers/userController.js

export const getUserInfo = async (req, res) => {
  try {
    const userId = req.user.userId;

    // جلب بيانات المستخدم مع استبعاد كلمة المرور
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

    // جلب الإشعارات الخاصة بالمستخدم
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 }) // الأحدث أولاً
      .lean(); 

    return res.status(200).json({
      user,
      notifications,
    });
  } catch (error) {
    console.error("Error in getUserInfo:", error.message);
    return res.status(500).json({
      message: "حدث خطأ أثناء جلب بيانات المستخدم والإشعارات",
      error: error.message,
    });
  }
};

// 1. Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params; // notificationId from URL

    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true } // return updated doc
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ message: "Notification marked as read", notification });
  } catch (error) {
    res.status(500).json({ message: "Error marking notification", error: error.message });
  }
};

// 2. Delete a notification
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params; // notificationId from URL

    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting notification", error: error.message });
  }
};
