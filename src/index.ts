import 'dotenv/config';
import express from "express";
import "reflect-metadata";
import { AppDataSource } from "./data-sources";
import cors from "cors";
import bookRoutes from "./routes/bookRoutes";

const app = express();

// Configure CORS
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Increase payload size limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

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