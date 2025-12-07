import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import generateProfileRoutes from "./routes/generateProfile.js";
import careersRoutes from "./routes/careers.js";
import tryListRoutes from "./routes/tryList.js";
import dashboardRoutes from "./routes/dashboard.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/generate-profile", generateProfileRoutes);
app.use("/api/careers", careersRoutes);
app.use("/api/try-list", tryListRoutes);
app.use("/api/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
