import app from "./app.js";
import prisma from "./config/db.js";

const PORT = process.env.PORT;

async function startServer() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");

    app.listen(PORT, () => {
      console.log("Server is running on port:", PORT);
    });
  } catch {
    console.error(" Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
