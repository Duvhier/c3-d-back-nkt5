import express from "express";
import "reflect-metadata";
import { AppDataSource } from "./data-sources";
import cors from "cors";

import bookRoutes from "./routes/bookRoutes";

const app = express();
app.use(express.json());
app.use(cors());



app.use("/api/books", bookRoutes);

AppDataSource.initialize().then(() => {
  if (process.env.VERCEL === "1") {
    // No hacer nada, Vercel maneja el serverless handler
  } else {
    app.listen(3000, '0.0.0.0', () => {
      console.log("🚀 Server running on http://localhost:3000");
    });
  }
});

export default app;