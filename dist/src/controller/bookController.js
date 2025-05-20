"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.updateBook = exports.createBook = exports.getBookById = exports.getBooks = void 0;
const data_sources_1 = require("../data-sources");
const Book_1 = require("../entity/Book");
const bookRepository = data_sources_1.AppDataSource.getRepository(Book_1.Book);
// Obtener todos los libros
const getBooks = async (req, res) => {
    try {
        const books = await bookRepository.find();
        console.log('Books fetched:', books); // Verifica los libros obtenidos
        res.json(books);
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener libros", error });
    }
};
exports.getBooks = getBooks;
// Obtener un libro por ID
const getBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await bookRepository.findOneBy({ id: parseInt(id) });
        if (!book) {
            return res.status(404).json({ message: "Libro no encontrado" });
        }
        res.json(book);
    }
    catch (error) {
        res.status(500).json({ message: "Error al buscar libro", error });
    }
};
exports.getBookById = getBookById;
// Crear un nuevo libro
const createBook = async (req, res) => {
    try {
        const { title, author, publishedDate, genre } = req.body;
        console.log('Request body:', req.body); // Verifica los datos recibidos
        if (!title || !author || !publishedDate || !genre) {
            return res.status(400).json({ message: "Todos los campos son requeridos" });
        }
        const newBook = bookRepository.create({ title, author, publishedDate, genre });
        await bookRepository.save(newBook);
        console.log('Book saved:', newBook); // Verifica el libro guardado
        res.status(201).json(newBook);
    }
    catch (error) {
        console.error('Error creating book:', error);
        res.status(500).json({ message: "Error al crear el libro", error });
    }
};
exports.createBook = createBook;
// Actualizar un libro existente
const updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, publishedDate, genre } = req.body;
        const book = await bookRepository.findOneBy({ id: parseInt(id) });
        if (!book) {
            return res.status(404).json({ message: "Libro no encontrado" });
        }
        bookRepository.merge(book, { title, author, publishedDate, genre });
        const updatedBook = await bookRepository.save(book);
        res.json(updatedBook);
    }
    catch (error) {
        res.status(500).json({ message: "Error al actualizar el libro", error });
    }
};
exports.updateBook = updateBook;
// Eliminar un libro
const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await bookRepository.delete(parseInt(id));
        if (result.affected === 0) {
            return res.status(404).json({ message: "Libro no encontrado" });
        }
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: "Error al eliminar el libro", error });
    }
};
exports.deleteBook = deleteBook;
