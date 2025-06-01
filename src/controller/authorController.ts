import { Request, Response } from "express";
import { AppDataSource } from "../data-sources";
import { Author } from "../entity/Author";
import { ObjectId } from "mongodb";

const authorRepository = AppDataSource.getMongoRepository(Author);

// Obtener todos los autores
export const getAuthors = async (req: Request, res: Response) => {
  try {
    const authors = await authorRepository.find();
    res.json(authors);
  } catch (error) {
    console.error('Error al obtener autores:', error);
    res.status(500).json({ message: 'Error al obtener autores', error });
  }
};

// Crear un nuevo autor
export const createAuthor = async (req: Request, res: Response) => {
  try {
    const { name, nationality, coverUrl } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'El nombre del autor es requerido' });
    }

    // Verificar si ya existe
    const existing = await authorRepository.findOne({ where: { name } });
    if (existing) {
      return res.status(409).json({ message: 'El autor ya existe' });
    }

    const newAuthor = authorRepository.create({
      name,
      nationality,
      coverUrl
    });

    const savedAuthor = await authorRepository.save(newAuthor);
    res.status(201).json(savedAuthor);
  } catch (error) {
    console.error('Error al crear autor:', error);
    res.status(500).json({ message: 'Error al crear autor', error });
  }
};

// Eliminar un autor
export const deleteAuthor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await authorRepository.delete(new ObjectId(id));
    if (result.affected === 0) {
      return res.status(404).json({ message: 'Autor no encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar autor:', error);
    res.status(500).json({ message: 'Error al eliminar autor', error });
  }
};

// Buscar autor por nombre
export const findAuthorByName = async (req: Request, res: Response) => {
  try {
    const { name } = req.query;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ message: 'El nombre es requerido' });
    }

    const author = await authorRepository.findOne({ where: { name } });

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