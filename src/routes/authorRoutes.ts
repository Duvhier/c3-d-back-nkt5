import { Router } from "express";
import { getAuthors, createAuthor, deleteAuthor, findAuthorByName } from "../controller/authorController";

const router = Router();

router.get("/", getAuthors);
router.post("/", createAuthor);
router.delete("/:id", deleteAuthor);
router.get("/search", findAuthorByName);

export default router;

