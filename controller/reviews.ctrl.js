const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = {
    getReview: async (req, res) => {
        try {
            const { movieId } = req.query;

            if (!movieId) {
                return res.status(400).json({ message: "Movie ID is required" });
            }

            // Check if the movie exists
            const movie = await prisma.movie.findUnique({
                where: { id: parseInt(movieId) },
            });

            // If the movie does not exist, return an error
            if (!movie) {
                return res.status(404).json({
                    message: "Movie not found",
                });
            }

            const reviews = await prisma.review.findMany({
                where: {
                    movieId: parseInt(movieId),
                },
            });

            res.status(200).json(reviews);
        } catch (error) {
            res.status(400).json({
                message: "Reviews retrieval failed"
            })
        }
    },
    getReviewById: async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ message: "Review ID is required" });
            }

            // Check if the review exists
            const review = await prisma.review.findUnique({
                where: { id: parseInt(id) },
            });

            // If the review does not exist, return an error
            if (!review) {
                return res.status(404).json({
                    message: "Review not found",
                });
            }

            res.status(200).json(review);
        } catch (error) {
            res.status(400).json({
                message: "Reviews retrieval failed"
            })
        }
    },
    addReview: async (req, res) => {
        try {

            const { movieId, reviewer, rating, comments } = req.body;

            if (rating < 1 || rating > 10) {
                return res.status(400).json({
                    message: "Rating must be between 1 to 10"
                })
            }

            // Check if the movie exists
            const movie = await prisma.movie.findUnique({
                where: { id: movieId },
            });

            // If the movie does not exist, return an error
            if (!movie) {
                return res.status(404).json({
                    message: "Movie not found",
                });
            }

            const review = await prisma.review.create({
                data: {
                    movieId,
                    reviewer,
                    rating,
                    comments,
                },
            });

            // Calculate the new average rating
            const reviews = await prisma.review.findMany({
                where: { movieId },
            });

            const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

            // Update the movie's average rating
            await prisma.movie.update({
                where: { id: movieId },
                data: {
                    averageRating: averageRating || null, // Set to null if no reviews
                },
            });

            res.status(201).json(review);

        } catch (error) {
            res.status(400).json({
                message: "Reviews creation failed"
            })
        }
    },
    updateReview: async (req, res) => {
        try {

            const { id } = req.params;
            const { movieId, reviewer, rating, comments } = req.body;

            if (parseFloat(rating) < 1 || parseFloat(rating) > 10) {
                return res.status(400).json({
                    message: "Rating must be between 1 to 10"
                })
            }

            const oldReview = await prisma.review.findUnique({
                where: { id: parseInt(id) },
            });

            const review = await prisma.review.update({
                where: { id: parseInt(id) },
                data: {
                    movieId,
                    reviewer,
                    rating,
                    comments,
                },
            });

            const oldReviews = await prisma.review.findMany({
                where: { movieId: oldReview?.movieId },
            });

            const oldAverageRating =
                oldReviews.length > 0
                    ? oldReviews.reduce((sum, r) => sum + r.rating, 0) / oldReviews.length
                    : null; // Set to null if no reviews            

            const newReviews = await prisma.review.findMany({
                where: { movieId },
            });

            const newAverageRating =
                newReviews.length > 0
                    ? newReviews.reduce((sum, r) => sum + r.rating, 0) / newReviews.length
                    : null; // Set to null if no reviews


            // Update the movie's average rating for old reviews
            await prisma.movie.update({
                where: { id: oldReview?.movieId },
                data: {
                    averageRating: oldAverageRating, // Set to null if no reviews
                },
            });

            // Update the movie's average rating for new reviews
            await prisma.movie.update({
                where: { id: movieId },
                data: {
                    averageRating: newAverageRating, // Set to null if no reviews
                },
            });

            res.status(200).json(review);

        } catch (error) {
            res.status(400).json({
                message: "Reviews retrieval failed"
            })
        }
    },
    deleteReview: async (req, res) => {
        try {

            const { id } = req.params;
            const review = await prisma.review.findUnique({
                where: { id: parseInt(id) },
            });

            // If the review does not exist, return an error
            if (!review) {
                return res.status(404).json({
                    message: "Review not found",
                });
            }

            // Get the movieId associated with the review
            const movieId = review.movieId;

            // Delete the review
            await prisma.review.delete({
                where: { id: parseInt(id) },
            });

            // Recalculate the average rating
            const reviews = await prisma.review.findMany({
                where: { movieId },
            });

            const averageRating =
                reviews.length > 0
                    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                    : null; // Set to null if no reviews

            // Update the movie's average rating
            await prisma.movie.update({
                where: { id: movieId },
                data: { averageRating },
            });

            res.status(200).json({
                message: "Review deleted successfully",
                averageRating,
            });

        } catch (error) {
            res.status(400).json({
                message: "Reviews retrieval failed"
            })
        }
    }
}