import 'dotenv/config';
import express from "express";
import "reflect-metadata";
import { AppDataSource } from "./data-sources";
import cors from "cors";
import bookRoutes from "./routes/bookRoutes";
import authorRoutes from "./routes/authorRoutes";
import genreRoutes from "./routes/genreRoutes";

const app = express();

// ✅ Leer orígenes permitidos desde variable de entorno
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir solicitudes sin origen (como Postman o SSR) o si el origen está permitido
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS: ' + origin));
    }
  },
  credentials: true
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

// Inicializar base de datos y lanzar servidor
AppDataSource.initialize().then(() => {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
});

export default app;
