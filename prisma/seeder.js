// Seeder script to populate the database with initial data
import prisma from "./client.js";

async function main() {
  // Seed installed_cameras (100 records)
  const installedCameras = await prisma.installed_camera.createMany({
    data: Array.from({ length: 100 }, (_, i) => ({
      camera_name: `Camera ${i + 1}`,
      bus_id: (i % 20) + 1,
      door_number: (i % 4) + 1,
      installed_camera_id: (i % 50) + 1,
      installed_bus_id: (i % 20) + 1,
      installed_door_bus_Id: (i % 10) + 1,
      installed_com_id: (i % 10) + 1,
      installed_on_activate: i % 2 === 0,
      installed_assces_key: `ACCESS_KEY_${String(i + 1).padStart(5, "0")}`,
    })),
  });
  console.log(`Created ${installedCameras.count} installed_cameras`);

  // Seed counters (100 records)
  const counters = await prisma.counter.createMany({
    data: Array.from({ length: 100 }, (_, i) => ({
      counter_in_count: Math.floor(Math.random() * 50) + 1,
      counter_out_count: Math.floor(Math.random() * 50) + 1,
      counter_bus_id: (i % 20) + 1,
      counter_installed_camera_id: (i % 100) + 1,
      counter_com_id: (i % 10) + 1,
      // Khon Kaen city area: lat 16.40-16.48, lng 102.78-102.88
      counter_lat: (16.4 + Math.random() * 0.08).toFixed(6).toString(),
      counter_lng: (102.78 + Math.random() * 0.1).toFixed(6).toString(),
    })),
  });
  console.log(`Created ${counters.count} counters`);

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
