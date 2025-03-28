import express from "express";
import cors from "cors";
import authRoutes from "./routers/auth.routes.js";
import userRoutes from "./routers/user.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

export default app;