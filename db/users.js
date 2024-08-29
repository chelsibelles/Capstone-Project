const prisma = require("./index");

const createUser = (userData) => {
  return prisma.users.create({
    data: userData,
  });
};

const getUserByUsername = (username) => {
  return prisma.users.findUnique({
    where: { username },
  });
};

const getUserById = (id) => {
  return prisma.users.findUnique({
    where: { user_id: id },
  });
};

module.exports = {
  createUser,
  getUserById,
  getUserByUsername,
};