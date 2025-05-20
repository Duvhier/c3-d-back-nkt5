import { DataSource } from "typeorm";
import { Book } from "./entity/Book";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL, // pon la URL de conexión aquí o usa variables de entorno
  synchronize: true,
  logging: false,
  entities: [Book],
  migrations: [],
  subscribers: [],
});