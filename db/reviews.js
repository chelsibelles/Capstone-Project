const prisma = require("./index");

const createReview = (reviewData) => {
  return prisma.review.create({
    data: reviewData,
  });
};

const getAllReviewsForFlower = (flowerId) => {
  return prisma.review.findMany({
    where: { flowerId },
    include: { user: true }, // Include user info if needed
  });
};

const getReviewById = (id) => {
  return prisma.review.findUnique({
    where: { id },
  });
};

const updateReview = (id, reviewData) => {
  return prisma.review.update({
    where: { id },
    data: reviewData,
  });
};

const deleteReview = async (id) => {
  try {
    const review = await getReviewById(id);
    if (review) {
      return prisma.review.delete({
        where: { id },
      });
    }
    throw new Error("Review not found");
  } catch (error) {
    console.error(`Error deleting review: ${error.message}`);
    throw error;
  }
};

module.exports = {
  createReview,
  getAllReviewsForFlower,
  getReviewById,
  updateReview,
  deleteReview,
};
