const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { requireUser } = require('./utils');
const router = express.Router();
const prisma = new PrismaClient(); // Ensure you instantiate PrismaClient here

// Create a new comment
router.post('/', requireUser, async (req, res) => {
    const { content, flowerId } = req.body;

    if (!content || !flowerId) {
        return res.status(400).json({ error: 'Content and flowerId are required.' });
    }

    try {
        const newComment = await prisma.comment.create({
            data: {
                content,
                flower: {
                    connect: { flower_id: flowerId }
                },
                user: {
                    connect: { id: req.user.id }
                }
            }
        });
        res.status(201).json(newComment);
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ error: 'Failed to create comment.' });
    }
});

// Get all comments for a specific flower
router.get('/flower/:flowerId', async (req, res) => {
    const { flowerId } = req.params;

    try {
        const comments = await prisma.comment.findMany({
            where: { flowerId: flowerId }, // Match field name in Prisma schema
            include: { user: true }
        });
        res.json(comments);
    } catch (error) {
        console.error('Error retrieving comments:', error);
        res.status(500).json({ error: 'Failed to retrieve comments.' });
    }
});

// Update a comment
router.put('/:commentId', requireUser, async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ error: 'Content is required.' });
    }

    try {
        const existingComment = await prisma.comment.findUnique({
            where: { id: commentId }
        });

        if (!existingComment) {
            return res.status(404).json({ error: 'Comment not found.' });
        }

        if (existingComment.userId !== req.user.id) {
            return res.status(403).json({ error: 'You are not authorized to update this comment.' });
        }

        const updatedComment = await prisma.comment.update({
            where: { id: commentId },
            data: { content }
        });

        res.json(updatedComment);
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ error: 'Failed to update comment.' });
    }
});

// Delete a comment
router.delete('/:commentId', requireUser, async (req, res) => {
    const { commentId } = req.params;

    try {
        const existingComment = await prisma.comment.findUnique({
            where: { id: commentId }
        });

        if (!existingComment) {
            return res.status(404).json({ error: 'Comment not found.' });
        }

        if (existingComment.userId !== req.user.id) {
            return res.status(403).json({ error: 'You are not authorized to delete this comment.' });
        }

        await prisma.comment.delete({
            where: { id: commentId }
        });

        res.status(204).end(); // No content to send back
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Failed to delete comment.' });
    }
});

module.exports = router;
