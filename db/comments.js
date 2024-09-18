const prisma = require("./index");

const createComment = (commentData) => {
  return prisma.comment.create({
    data: commentData,
  });
};

const getAllCommentsForFlower = (flowerId) => {
  return prisma.comment.findMany({
    where: { flowerId },
    include: { user: true }, // Include user info if needed
  });
};

const getCommentById = (id) => {
  return prisma.comment.findUnique({
    where: { id },
  });
};

const updateComment = (id, commentData) => {
  return prisma.comment.update({
    where: { id },
    data: commentData,
  });
};

const deleteComment = async (id) => {
  try {
    const comment = await getCommentById(id);
    if (comment) {
      return prisma.comment.delete({
        where: { id },
      });
    }
    throw new Error("Comment not found");
  } catch (error) {
    console.error(`Error deleting comment: ${error.message}`);
    throw error;
  }
};

module.exports = {
  createComment,
  getAllCommentsForFlower,
  getCommentById,
  updateComment,
  deleteComment,
};
