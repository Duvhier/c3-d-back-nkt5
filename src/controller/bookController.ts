import { Request, Response } from "express";
import { AppDataSource } from "../data-sources";
import { Book } from "../entity/Book";

const bookRepository = AppDataSource.getRepository(Book);

// Obtener todos los libros vercel
export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await bookRepository.find();
    console.log('Books fetched:', books); // Verifica los libros obtenidos
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener libros", error });
  }
};

// Obtener un libro por ID
export const getBookById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const book = await bookRepository.findOneBy({ id: parseInt(id) });
    if (!book) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: "Error al buscar libro", error });
  }
};

// Crear un nuevo libro
export const createBook = async (req: Request, res: Response) => {
  try {
    const { title, author, publishedDate, genre, description, coverUrl } = req.body;

    console.log('Request body:', req.body); // Verifica los datos recibidos

    if (!title || !author || !publishedDate || !genre) {
      return res.status(400).json({ message: "Todos los campos son requeridos" });
    }

    const newBook = bookRepository.create({ 
      title, 
      author, 
      publishedDate, 
      genre,
      description: description || '',
      coverUrl: coverUrl || ''
    });
    await bookRepository.save(newBook);

    console.log('Book saved:', newBook); // Verifica el libro guardado

    res.status(201).json(newBook);
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ message: "Error al crear el libro", error });
  }
};

// Actualizar un libro existente
export const updateBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, author, publishedDate, genre, description, coverUrl } = req.body;

    const book = await bookRepository.findOneBy({ id: parseInt(id) });
    if (!book) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }

    bookRepository.merge(book, { 
      title, 
      author, 
      publishedDate, 
      genre,
      description: description || book.description,
      coverUrl: coverUrl || book.coverUrl
    });
    const updatedBook = await bookRepository.save(book);
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
    const result = await bookRepository.delete(parseInt(id));
    if (result.affected === 0) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el libro", error });
  }
};
