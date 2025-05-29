import { Router } from "express";
import { getGenres, createGenre } from "../controller/bookController";

const router = Router();

router.get("/", getGenres);
router.post("/", createGenre);

export default router;

