import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Falta la variable de entorno MONGODB_URI');
}

const client = new MongoClient(uri);
let db: Db | null = null;

/**
 * Conecta a la base de datos MongoDB.
 */
export async function connectDB(): Promise<void> {
  try {
    await client.connect();
    db = client.db('library_db'); // Cambia 'library' si tu base tiene otro nombre
    console.log('MongoDB conectado');
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
    throw error;
  }
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
  await client.close();
  console.log('MongoDB desconectado');
}
