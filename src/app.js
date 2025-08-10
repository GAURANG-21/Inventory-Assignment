import express from "express";
import dotenv from "dotenv";
import { adminRoutes, authRoutes, productRoutes } from "./routes/index.js";
import morgan from "morgan";
import chalk from "chalk";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

morgan.token("statusColor", (req, res) => {
  const status = res.statusCode;
  if (status >= 500) return chalk.red(status);
  if (status >= 400) return chalk.yellow(status);
  if (status >= 300) return chalk.cyan(status);
  if (status >= 200) return chalk.green(status);
  return status;
});

morgan.token("methodEmoji", (req) => {
  const method = req.method;
  switch (method) {
    case "GET":
      return "🟢 GET";
    case "POST":
      return "🟡 POST";
    case "PUT":
      return "🟠 PUT";
    case "DELETE":
      return "🔴 DELETE";
    default:
      return method;
  }
});

app.use(
  morgan((tokens, req, res) => {
    return [
      chalk.magenta.bold("[API LOG]"),
      tokens.methodEmoji(req, res),
      chalk.blue(tokens.url(req, res)),
      tokens.statusColor(req, res),
      chalk.white(`${tokens["response-time"](req, res)} ms`),
      chalk.gray(`- ${tokens.res(req, res, "content-length") || 0} bytes`),
    ].join(" ");
  })
);

app.use("/", authRoutes);
app.use("/", productRoutes);
app.use("/admin/", adminRoutes);
app.get("/", (req, res) => {
  res.send(`
    <h1>Server is active!</h1>
    <p>Frontend URL: <a href="${process.env.FRONTEND_URL}" target="_blank" rel="noopener noreferrer">${process.env.FRONTEND_URL}</a></p>
    <p>API documentation available at <a href="/docs" target="_blank" rel="noopener noreferrer">/docs</a></p>
  `);
});

export default app;
