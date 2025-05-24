import { AppDataSource } from "./data-sources";
import 'dotenv/config';

async function verifyConnection() {
  try {
    console.log("Verificando conexión a MongoDB...");
    console.log("URI de conexión:", process.env.MONGODB_URI);
    
    // Initialize MongoDB connection
    await AppDataSource.initialize();
    console.log("\n✅ Conexión exitosa a MongoDB Atlas");
    
    // Verificar la base de datos
    const database = AppDataSource.driver.database;
    console.log("\nBase de datos conectada:", database);
    
    // Cerrar la conexión
    await AppDataSource.destroy();
    console.log("\n✅ Conexión cerrada correctamente");
    
  } catch (error) {
    console.error("\n❌ Error al conectar con MongoDB:", error);
    process.exit(1);
  }
}

// Ejecutar la verificación
verifyConnection(); 