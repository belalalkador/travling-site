import express from "express";
import cors from "cors";
import morgan from "morgan"; // ✅ import morgan
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import userRouter from "./routers/userRouter.js";
import DBconnect from "./config/DBconnect.js";
import adminRouter from "./routers/adminRouter.js";
import comRouter from "./routers/companyRouter.js";
import customerRouter from "./routers/customerRouter.js";

dotenv.config();

const app = express();

// ✅ Use morgan middleware for logging HTTP requests
app.use(morgan("dev"));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/user/api/v1", userRouter);
app.use("/admin/api/v1", adminRouter);
app.use("/companey/api/v1", comRouter);
app.use("/customer/api/v1", customerRouter);

DBconnect();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ السيرفر شغال على http://localhost:${PORT}`);
});
