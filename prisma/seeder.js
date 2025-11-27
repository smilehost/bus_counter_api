// Seeder script to populate the database with initial data
import prisma from "./client.js";
async function main() {
  //   await prisma.testmodel.createMany({
  //     data: [
  //       { name: "Sample Data 1" },
  //       { name: "Sample Data 2" },
  //       { name: "Sample Data 3" },
  //     ],
  //   });
  console.log("Database seeded successfully.");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
