import { Router } from "express";
import { getBooks, getBookById, createBook, updateBook, deleteBook } from "../controller/bookController";

const router = Router();

router.get("/", getBooks);
router.get("/:id", getBookById);
router.post("/", createBook);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);



export default router;
