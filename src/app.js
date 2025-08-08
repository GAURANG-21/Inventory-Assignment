import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";

dotenv.config();

const app = express();
app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;
