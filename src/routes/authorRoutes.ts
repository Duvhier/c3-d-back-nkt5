import { Router } from "express";
import { 
  getAuthors, 
  createAuthor, 
  getBooksByAuthor 
} from "../controller/bookController";

const router = Router();

// Rutas de autores
router.get("/", getAuthors);
router.get("/:id/books", getBooksByAuthor);
router.post("/", createAuthor);

export default router;

