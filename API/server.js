import express from "express";
import cors from "cors";
import morgan from "morgan"; 
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { app, server } from './socket/socket.js';
import userRouter from "./routers/userRouter.js";
import DBconnect from "./config/DBconnect.js";
import adminRouter from "./routers/adminRouter.js";
import comRouter from "./routers/companyRouter.js";
import customerRouter from "./routers/customerRouter.js";

dotenv.config();

// ✅ Use morgan middleware for logging HTTP requests
app.use(morgan("dev"));


app.use(express.json());
app.use(cookieParser());

app.use("/user/api/v1", userRouter);
app.use("/admin/api/v1", adminRouter);
app.use("/companey/api/v1", comRouter);
app.use("/customer/api/v1", customerRouter);

DBconnect();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ السيرفر شغال على http://localhost:${PORT}`);
});
