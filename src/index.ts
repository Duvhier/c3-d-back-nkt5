import 'dotenv/config';
import express from "express";
import "reflect-metadata";
import { AppDataSource } from "./data-sources";
import cors from "cors";
import bookRoutes from "./routes/bookRoutes";
import authorRoutes from "./routes/authorRoutes";
import genreRoutes from "./routes/genreRoutes";

const app = express();

// Configuración de CORS más permisiva para desarrollo
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['*'];

app.use(cors({
  origin: function (origin, callback) {
    // En producción, verificar orígenes permitidos
    if (process.env.NODE_ENV === 'production') {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('No permitido por CORS: ' + origin));
      }
    } else {
      // En desarrollo, permitir todos los orígenes
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para manejar payloads grandes
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Middleware para manejar errores
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
  });
});

// Rutas API
app.use('/api/books', bookRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/genres', genreRoutes);

app.get('/', (req, res) => {
  res.send('🚀 Backend está corriendo!');
});

// Inicializar base de datos y lanzar servidor
AppDataSource.initialize()
  .then(() => {
    const port = parseInt(process.env.PORT || '3000', 10);
    const server = app.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${port}`);
    });

    // Configurar timeouts
    server.timeout = 120000; // 2 minutos
    server.keepAliveTimeout = 120000;
  })
  .catch((error) => {
    console.error('Error durante la inicialización:', error);
    process.exit(1);
  });

export default app;
