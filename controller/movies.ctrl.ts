import { Request, Response } from "express"

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

module.exports = {
    getMovie: async (req: Request, res: Response) => {
        try {
            const movies = await prisma.movie.findMany();
            res.status(200).json(movies);
        } catch (error) {
            res.status(400).json({
                message: "Movies retrieved failed"
            })
        }
    },
    getMovieById: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            // Fetch the movie by ID
            const movie = await prisma.movie.findUnique({
                where: {
                    id: parseInt(id), // Convert the ID to an integer
                },
            });

            // If the movie is not found, return a 404 response
            if (!movie) {
                return res.status(404).json({
                    message: "Movie not found",
                });
            }

            // Return the found movie
            res.status(200).json(movie);
        } catch (error) {
            console.error(error); // Log the error for debugging
            res.status(500).json({
                message: "Failed to retrieve movie",
            });
        }
    },
    addMovie: async (req: Request, res: Response) => {
        try {
            const { name, releaseDate } = req.body;
            const movie = await prisma.movie.create({
                data: {
                    name,
                    releaseDate: new Date(releaseDate)
                },
            });
            res.status(200).json(movie);
        } catch (error) {
            res.status(400).json({
                message: "Movie is not added"
            })
        }
    },
    updateMovie: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { name, releaseDate } = req.body;
            const movie = await prisma.movie.update({
                where: { id: parseInt(id) },
                data: {
                    name,
                    releaseDate: new Date(releaseDate),
                },
            });
            res.status(200).json(movie);
        } catch (error) {
            res.status(400).json({
                message: "Movie is not updated"
            })
        }
    },
    deleteMovie: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await prisma.review.deleteMany({
                where: { movieId: parseInt(id) },
            });
            await prisma.movie.delete({
                where: { id: parseInt(id) },
            });
            res.status(200).json({ message: 'Movie deleted' });
        } catch (error) {
            res.status(400).json({
                message: "Movie is not deleted"
            })
        }
    }
}