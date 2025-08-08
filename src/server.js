import app from "./app.js";

const PORT = process.env.PORT;

async function startServer() {
  try {
    app.listen(() => {
      console.log("Server is running on port: ", PORT);
    });
  } catch {
    console.error(error);
  }
}

startServer();
