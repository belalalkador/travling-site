import mongoose from "mongoose";
import { type } from "os";

const notificationSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    isRead:{
        type:Boolean,
        default:false
    }  
  },
  { timestamps: true }
);
const Notification=mongoose.model("Notification", notificationSchema);

export default Notification;
