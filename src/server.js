import app from "./app.js";
import prisma from "./config/db.js";
import swaggerUi from "swagger-ui-express";
import fs from "fs";

const PORT = process.env.PORT;
const swaggerDocument = JSON.parse(
  fs.readFileSync("./node-output/swagger.yaml")
);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

async function startServer() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");

    app.listen(PORT, () => {
      console.log("Server is running on port:", PORT);
      console.log(`📄 Swagger docs available at http://localhost:${PORT}/docs`);
    });
  } catch {
    console.error(" Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
