import { Request, Response } from "express";
import { AppDataSource } from "../data-sources";
import { Book } from "../entity/Book";
import { ObjectId } from "mongodb";
import { connectDB, getDB } from "../mongo";

const bookRepository = AppDataSource.getMongoRepository(Book);

// Obtener todos los libros
export const getBooks = async (req: Request, res: Response) => {
  try {
    await connectDB();
    const db = getDB();
    const books = await db.collection('books').find().toArray();
    console.log('Books fetched:', books);
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: "Error al obtener libros", error });
  }
};

// Obtener un libro por ID
export const getBookById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const book = await bookRepository.findOneBy({ _id: new ObjectId(id) });
    if (!book) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }
    res.json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ message: "Error al buscar libro", error });
  }
};

// Crear un nuevo libro
export const createBook = async (req: Request, res: Response) => {
  try {
    const { title, author, publishedDate, genre, coverUrl } = req.body;

    console.log('Request body:', req.body);

    if (!title || !author || !publishedDate || !genre) {
      return res.status(400).json({ message: "Todos los campos son requeridos" });
    }

    const newBook = bookRepository.create({
      title,
      author,
      publishedDate,
      genre,
      coverUrl: coverUrl || ''
    });

    const savedBook = await bookRepository.save(newBook);
    console.log('Book saved:', savedBook);

    res.status(201).json(savedBook);
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ message: "Error al crear el libro", error });
  }
};

// Actualizar un libro existente
export const updateBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, author, publishedDate, genre, coverUrl } = req.body;

    const book = await bookRepository.findOneBy({ _id: new ObjectId(id) });
    if (!book) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }

    const updatedBook = await bookRepository.save({
      ...book,
      title: title || book.title,
      author: author || book.author,
      publishedDate: publishedDate || book.publishedDate,
      genre: genre || book.genre,
      coverUrl: coverUrl || book.coverUrl
    });

    res.json(updatedBook);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: "Error al actualizar el libro", error });
  }
};

// Eliminar un libro
export const deleteBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await bookRepository.delete(new ObjectId(id));
    if (result.affected === 0) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: "Error al eliminar el libro", error });
  }
};
