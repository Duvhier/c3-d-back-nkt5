import { Router } from "express";
import { getAuthors, createAuthor } from "../controller/bookController";

const router = Router();

router.get("/", getAuthors);
router.post("/", createAuthor);

export default router;

