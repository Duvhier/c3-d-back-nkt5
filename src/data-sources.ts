import { DataSource } from "typeorm";
import { Book } from "./entity/Book";
import 'dotenv/config';

export const AppDataSource = new DataSource({
  type: "mongodb",
  url: process.env.MONGODB_URI,
  synchronize: true,
  logging: true,
  entities: [Book],
  migrations: [],
  subscribers: []
});