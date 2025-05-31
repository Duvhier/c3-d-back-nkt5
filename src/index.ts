import 'dotenv/config';
import express from "express";
import "reflect-metadata";
import { AppDataSource } from "./data-sources";
import cors from "cors";
import bookRoutes from "./routes/bookRoutes";
import authorRoutes from "./routes/authorRoutes";
import genreRoutes from "./routes/genreRoutes";

const app = express();


// ✅ Configurar CORS correctamente para permitir credenciales desde el frontend
app.use(cors({
    origin: ['https://c3-d-front-nkt5.vercel.app', 'http://localhost:5173'],
    credentials: true,
}));

// Middleware para manejar payloads grandes (opcional)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Rutas API
app.use('/api/books', bookRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/genres', genreRoutes);

app.get('/', (req, res) => {
    res.send('🚀 Backend está corriendo!');
});

// Inicializar base de datos y lanzar servidor si no está en Vercel
AppDataSource.initialize().then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log("🚀 Server running on port", process.env.PORT || 3000);
    });
});

export default app;