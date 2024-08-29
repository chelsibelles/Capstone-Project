const prisma = require("./index");

const createFlower = (flowerData) => {
  return prisma.flowers.create({
    data: flowerData,
  });
};

const getAllFlowers = (user_id) => {
  return prisma.flowers.findMany({
    where: { user_id },
  });
};

const getFlowerById = (id) => {
  return prisma.flowers.findUnique({
    where: { flower_id: id },
  });
};

const updateFlower = (id, flowerData) => {
  return prisma.flowers.update({
    where: { flower_id: id },
    data: flowerData,
  });
};

const deleteFlower = async (id) => {
  try {
    const flower = await getFlowerById(id);
    if (flower) {
      return prisma.flowers.delete({
        where: { flower_id: id },
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
