import express from "express";
import dotenv from "dotenv";
import { authRoutes, productRoutes } from "./routes/index.js";
import morgan from "morgan";
import chalk from "chalk";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

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

export default app;
