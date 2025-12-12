// Seeder script to populate the database with initial data
import prisma from "./client.js";

// City coordinates
const cities = [
  {
    name: "Khon Kaen",
    lat: { min: 16.4, max: 16.48 },
    lng: { min: 102.78, max: 102.88 },
  },
  {
    name: "Bangkok",
    lat: { min: 13.7, max: 13.8 },
    lng: { min: 100.5, max: 100.6 },
  },
  {
    name: "Chiang Mai",
    lat: { min: 18.7, max: 18.8 },
    lng: { min: 98.9, max: 99.0 },
  },
];

function getRandomCity(index) {
  const city = cities[index % cities.length];
  return {
    lat: (city.lat.min + Math.random() * (city.lat.max - city.lat.min))
      .toFixed(6)
      .toString(),
    lng: (city.lng.min + Math.random() * (city.lng.max - city.lng.min))
      .toFixed(6)
      .toString(),
  };
}

async function main() {
  // Seed installed_cameras (60 records - 3 cameras per bus for 20 buses)
  const installedCameras = await prisma.installed_camera.createMany({
    data: Array.from({ length: 60 }, (_, i) => ({
      camera_name: `Camera ${i + 1}`,
      bus_id: (i % 20) + 1,
      door_number: (i % 3) + 1,
      installed_camera_id: i + 1,
      installed_bus_id: (i % 20) + 1,
      installed_door_bus_Id: (i % 3) + 1,
      installed_com_id: (i % 10) + 1,
      installed_on_activate: i % 2 === 0,
      installed_assces_key: `ACCESS_KEY_${String(i + 1).padStart(5, "0")}`,
    })),
  });
  console.log(`Created ${installedCameras.count} installed_cameras`);

  // Seed counters (60 records - distributed across 3 cities)
  const counters = await prisma.counter.createMany({
    data: Array.from({ length: 60 }, (_, i) => {
      const location = getRandomCity(i);
      return {
        counter_in_count: Math.floor(Math.random() * 50) + 1,
        counter_out_count: Math.floor(Math.random() * 50) + 1,
        counter_bus_id: (i % 20) + 1,
        counter_installed_camera_id: (i % 60) + 1,
        counter_com_id: (i % 10) + 1,
        counter_lat: location.lat,
        counter_lng: location.lng,
      };
    }),
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
