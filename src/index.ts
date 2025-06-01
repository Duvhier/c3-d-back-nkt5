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
  origin: '*', // Permitir todos los orígenes en desarrollo
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para manejar payloads grandes
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Middleware para logging de requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Rutas API
app.use('/api/books', bookRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/genres', genreRoutes);

app.get('/', (req, res) => {
  res.send('🚀 Backend está corriendo!');
});

// Middleware para manejar errores
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
  });
});

// Función para iniciar el servidor
const startServer = async () => {
  try {
    // Inicializar la conexión a la base de datos
    await AppDataSource.initialize();
    console.log('✅ Base de datos conectada');

    const port = parseInt(process.env.PORT || '3000', 10);
    const server = app.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`📝 API Documentation: http://localhost:${port}`);
    });

    // Configurar timeouts
    server.timeout = 120000; // 2 minutos
    server.keepAliveTimeout = 120000;

    // Manejar errores del servidor
    server.on('error', (error: any) => {
      console.error('Error del servidor:', error);
      if (error.code === 'EADDRINUSE') {
        console.error(`El puerto ${port} está en uso. Intenta con otro puerto.`);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('Error durante la inicialización:', error);
    process.exit(1);
  }
};

// Iniciar el servidor
startServer();

export default app;
