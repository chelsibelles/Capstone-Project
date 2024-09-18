const express = require('express');
const { PrismaClient } = require("@prisma/client");
const { requireUser } = require('./utils');

const router = express.Router();
const prisma = new PrismaClient(); // Initialize Prisma Client

// Create a new review
router.post('/', requireUser, async (req, res) => {
    const { rating, content, flowerId } = req.body;

    if (!rating || !flowerId) {
        return res.status(400).json({ error: 'Rating and flowerId are required.' });
    }

    try {
        const newReview = await prisma.review.create({
            data: {
                rating,
                content,
                flower: {
                    connect: { id: flowerId } // Ensure the Prisma field matches your schema
                },
                user: {
                    connect: { id: req.user.id }
                }
            }
        });
        res.status(201).json(newReview);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create review.' });
    }
});

// Get all reviews for a specific flower
router.get('/flower/:flowerId', async (req, res) => {
    const { flowerId } = req.params;

    try {
        const reviews = await prisma.review.findMany({
            where: { flowerId: parseInt(flowerId) }, // Ensure the Prisma field matches your schema
            include: { user: true }
        });
        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve reviews.' });
    }
});

// Update a review
router.put('/:reviewId', requireUser, async (req, res) => {
    const { reviewId } = req.params;
    const { rating, content } = req.body;

    if (!rating && !content) {
        return res.status(400).json({ error: 'At least one of rating or content is required.' });
    }

    try {
        const existingReview = await prisma.review.findUnique({
            where: { id: reviewId }
        });

        if (!existingReview) {
            return res.status(404).json({ error: 'Review not found.' });
        }

        if (existingReview.userId !== req.user.id) {
            return res.status(403).json({ error: 'You are not authorized to update this review.' });
        }

        const updatedReview = await prisma.review.update({
            where: { id: reviewId },
            data: { rating, content }
        });

        res.json(updatedReview);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update review.' });
    }
});

// Delete a review
router.delete('/:reviewId', requireUser, async (req, res) => {
    const { reviewId } = req.params;

    try {
        const existingReview = await prisma.review.findUnique({
            where: { id: reviewId }
        });

        if (!existingReview) {
            return res.status(404).json({ error: 'Review not found.' });
        }

        if (existingReview.userId !== req.user.id) {
            return res.status(403).json({ error: 'You are not authorized to delete this review.' });
        }

        await prisma.review.delete({
            where: { id: reviewId }
        });

        res.status(204).end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete review.' });
    }
});

module.exports = router;
