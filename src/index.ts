import 'dotenv/config';
import express from "express";
import "reflect-metadata";
import { AppDataSource } from "./data-sources";
import cors from "cors";
import bookRoutes from "./routes/bookRoutes";

const app = express();

// ✅ Configurar CORS correctamente para permitir credenciales desde el frontend
app.use(cors({
origin: 'http://localhost:5173',
credentials: true,
methods: ['GET', 'POST', 'PUT', 'DELETE'],
allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para manejar payloads grandes (opcional)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Rutas API
app.use("/api/books", bookRoutes);

// Inicializar base de datos y lanzar servidor si no está en Vercel
AppDataSource.initialize().then(() => {
if (process.env.VERCEL === "1") {
// En Vercel, no se levanta un servidor tradicional
} else {
app.listen(3000, '0.0.0.0', () => {
console.log("🚀 Server running on http://localhost:3000");
});
}
});

export default app;