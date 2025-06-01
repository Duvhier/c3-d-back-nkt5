import { Router } from "express";
import { getAuthors, createAuthor, getBooksByAuthor } from "../controller/bookController";

const router = Router();

router.get("/", getAuthors);
router.get("/:authorName/books", getBooksByAuthor);
router.post("/", createAuthor);

export default router;

