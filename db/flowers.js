const prisma = require("./index");

const createFlower = (flowerData) => {
  return prisma.flower.create({  // Ensure 'flower' matches the Prisma schema
    data: flowerData,
  });
};

const getAllFlowers = (user_id) => {
  return prisma.flower.findMany({  // Ensure 'flower' matches the Prisma schema
    where: { user_id },
  });
};

const getFlowerById = (id) => {
  return prisma.flower.findUnique({  // Ensure 'flower' matches the Prisma schema
    where: { id },  // Ensure 'id' matches the Prisma schema
  });
};

const updateFlower = (id, flowerData) => {
  return prisma.flower.update({  // Ensure 'flower' matches the Prisma schema
    where: { id },  // Ensure 'id' matches the Prisma schema
    data: flowerData,
  });
};

const deleteFlower = async (id) => {
  try {
    const flower = await getFlowerById(id);
    if (flower) {
      return prisma.flower.delete({  // Ensure 'flower' matches the Prisma schema
        where: { id },  // Ensure 'id' matches the Prisma schema
      });
    }
    throw new Error("Flower not found");
  } catch (error) {
    console.error(`Error deleting flower: ${error.message}`);
    throw error; 
  }
};

module.exports = {
  createFlower,
  getAllFlowers,
  getFlowerById,
  updateFlower,
  deleteFlower,
};
