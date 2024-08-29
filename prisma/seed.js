const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");
const flowerNames = require("./flowerNames");

const prisma = new PrismaClient();

async function main() {
  // Seed 3 users
  console.log("Creating Initial User Data...");
  const users = await Promise.all(
    [...Array(3)].map(() =>
      prisma.user.create({
        data: {
          username: faker.internet.userName(),
          password: faker.internet.password(),
          email: faker.internet.email(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
        },
      })
    )
  );

  // Seed flowers (3 flowers per user)
  console.log("Creating Initial Flower Data...");
  await Promise.all(
    users.map((user) =>
      Promise.all(
        [...Array(3)].map(async () => {
          const randomNum = Math.round(Math.random());
          
          await prisma.flower.create({
            data: {
              name: flowerNames[Math.floor(Math.random() * flowerNames.length)],
              description: faker.lorem.sentence(),
              care_instructions: faker.lorem.sentence(),
              img_url: faker.image.imageUrl(), 
              user_id: user.user_id, 
            },
          });
        })
      )
    )
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    return e;
  });
