import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Falta la variable de entorno MONGODB_URI');
}

const client = new MongoClient(uri, {
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 10000,
  maxPoolSize: 50,
  minPoolSize: 10,
  maxIdleTimeMS: 60000,
  retryWrites: true,
  retryReads: true
});

let db: Db | null = null;
let isConnecting = false;
let connectionPromise: Promise<void> | null = null;

/**
 * Conecta a la base de datos MongoDB con manejo de reconexión.
 */
export async function connectDB(): Promise<void> {
  if (db) {
    return;
  }

  if (isConnecting) {
    if (connectionPromise) {
      return connectionPromise;
    }
  }

  isConnecting = true;
  connectionPromise = (async () => {
    try {
      await client.connect();
      db = client.db('library_db');
      console.log('MongoDB conectado');
    } catch (error) {
      console.error('Error conectando a MongoDB:', error);
      db = null;
      throw error;
    } finally {
      isConnecting = false;
      connectionPromise = null;
    }
  })();

  return connectionPromise;
}

/**
 * Devuelve la instancia de la base de datos MongoDB conectada.
 * @returns {Db} Instancia de la base de datos.
 */
export function getDB(): Db {
  if (!db) {
    throw new Error('La base de datos no está inicializada');
  }
  return db;
}

/**
 * Cierra la conexión con MongoDB.
 */
export async function closeDB(): Promise<void> {
  try {
    await client.close();
    db = null;
    console.log('MongoDB desconectado');
  } catch (error) {
    console.error('Error al cerrar la conexión con MongoDB:', error);
    throw error;
  }
}

// Manejar desconexiones inesperadas
client.on('close', () => {
  console.log('Conexión a MongoDB cerrada inesperadamente');
  db = null;
});

client.on('error', (error) => {
  console.error('Error en la conexión de MongoDB:', error);
  db = null;
});
