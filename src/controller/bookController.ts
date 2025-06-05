import { Request, Response } from "express";
import { AppDataSource } from "../data-sources";
import { Book } from "../entity/Book";
import { ObjectId } from "mongodb";
import { connectDB, getDB } from "../mongo";

const bookRepository = AppDataSource.getMongoRepository(Book);

// Obtener todos los libros vercel
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
    console.error("Error updating book:", error);
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

// Obtener todos los autores
export const getAuthors = async (req: Request, res: Response) => {
  try {
    await connectDB();
    const db = getDB();
    const authors = await db.collection('authors').find().toArray();
    res.json(authors);
  } catch (error: any) {
    console.error('Error al obtener autores:', error);
    res.status(500).json({ 
      message: 'Error al obtener autores', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

// Crear un nuevo autor
export const createAuthor = async (req: Request, res: Response) => {
  try {
    const { name, nationality, coverUrl } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'El nombre del autor es requerido' });
    }

    await connectDB();
    const db = getDB();

    // Verificar si ya existe
    const existing = await db.collection('authors').findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });
    
    if (existing) {
      return res.status(409).json({ 
        message: 'El autor ya existe',
        existingAuthor: existing
      });
    }

    const newAuthor = {
      name,
      nationality: nationality || '',
      coverUrl: coverUrl || ''
    };

    const result = await db.collection('authors').insertOne(newAuthor);
    
    res.status(201).json({ 
      _id: result.insertedId,
      ...newAuthor
    });
  } catch (error: any) {
    console.error('Error al crear autor:', error);
    res.status(500).json({ 
      message: 'Error al crear autor', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

// Eliminar un autor
export const deleteAuthor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await connectDB();
    const db = getDB();
    const result = await db.collection('authors').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Autor no encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar autor:', error);
    res.status(500).json({ message: 'Error al eliminar autor', error });
  }
};

// Buscar autor por nombre (usado por el frontend)
export const findAuthorByName = async (req: Request, res: Response) => {
  try {
    const { name } = req.query;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ message: 'El nombre es requerido' });
    }

    await connectDB();
    const db = getDB();

    const author = await db.collection('authors').findOne({ name });

    if (author) {
      return res.json({ found: true, author });
    } else {
      return res.json({ found: false });
    }
  } catch (error) {
    console.error('Error al buscar autor:', error);
    res.status(500).json({ message: 'Error al buscar autor', error });
  }
};

// Obtener todos los géneros
export const getGenres = async (req: Request, res: Response) => {
  try {
    await connectDB();
    const db = getDB();
    const genres = await db.collection('genres').find().toArray();
    res.json(genres);
  } catch (error) {
    console.error('Error al obtener géneros:', error);
    res.status(500).json({ message: 'Error al obtener géneros', error });
  }
};

// Buscar género por nombre (usado por el frontend)
export const findGenreByName = async (req: Request, res: Response) => {
  try {
    const { name } = req.query;

    if (!name || typeof name !== 'string') {  
      return res.status(400).json({ message: 'El nombre es requerido' });
    }

    await connectDB();
    const db = getDB();

    const genre = await db.collection('genres').findOne({ name });

    if (genre) {
      return res.json({ found: true, genre });
    } else {
      return res.json({ found: false });
    }
  } catch (error) { 
    console.error('Error al buscar género:', error);
    res.status(500).json({ message: 'Error al buscar género', error });
  }
};


// Crear un nuevo género
export const createGenre = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'El nombre del género es requerido' });
    }

    await connectDB();
    const db = getDB();

    // Verificar si ya existe
    const existing = await db.collection('genres').findOne({ name });
    if (existing) {
      return res.status(409).json({ message: 'El género ya existe' });
    }

    const result = await db.collection('genres').insertOne({ name });
    res.status(201).json({ _id: result.insertedId, name });
  } catch (error) {
    console.error('Error al crear género:', error);
    res.status(500).json({ message: 'Error al crear género', error });
  }
};



