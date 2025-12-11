// Seeder script to populate the database with initial data
import prisma from "./client.js";

async function main() {
  // Seed companies (20 records)
  const companies = await prisma.company.createMany({
    data: Array.from({ length: 20 }, (_, i) => ({
      com_external_id: 1000 + i,
      com_prefix: `COM${String(i + 1).padStart(3, "0")}`,
      com_status: i % 2 === 0 ? 1 : 0,
    })),
  });
  console.log(`Created ${companies.count} companies`);

  // Seed buses (20 records)
  const buses = await prisma.bus.createMany({
    data: Array.from({ length: 20 }, (_, i) => ({
      bus_com_id: (i % 20) + 1,
      bus_status: i % 3 === 0 ? 1 : 0,
      bus_external_id: 2000 + i,
    })),
  });
  console.log(`Created ${buses.count} buses`);

  // Seed busrounds (20 records)
  const busrounds = await prisma.busround.createMany({
    data: Array.from({ length: 20 }, (_, i) => ({
      busround_external_id: 3000 + i,
      busround_com_id: (i % 20) + 1,
      busround_bus_id: (i % 20) + 1,
    })),
  });
  console.log(`Created ${busrounds.count} busrounds`);

  // Seed door_bus (20 records)
  const doorTypes = ["IN", "OUT", "IN_OUT"];
  const doorBuses = await prisma.door_bus.createMany({
    data: Array.from({ length: 20 }, (_, i) => ({
      door_type: doorTypes[i % 3],
      door_bus_id: (i % 20) + 1,
      door_bus_number: `D${String(i + 1).padStart(3, "0")}`,
    })),
  });
  console.log(`Created ${doorBuses.count} door_buses`);

  // Seed camera_devices (20 records)
  const cameraDevices = await prisma.camera_device.createMany({
    data: Array.from({ length: 20 }, (_, i) => ({
      camera_name: `Camera ${i + 1}`,
      camera_status: i % 2 === 0 ? 1 : 0,
      com_id: (i % 20) + 1,
    })),
  });
  console.log(`Created ${cameraDevices.count} camera_devices`);

  // Seed installed_cameras (20 records)
  const installedCameras = await prisma.installed_camera.createMany({
    data: Array.from({ length: 20 }, (_, i) => ({
      installed_camera_id: (i % 20) + 1,
      installed_bus_id: (i % 20) + 1,
      door_bus_Id: (i % 20) + 1,
      installed_com_id: (i % 20) + 1,
      installed_on_activate: i % 2 === 0,
      installed_assces_key: `ACCESS_KEY_${String(i + 1).padStart(5, "0")}`,
    })),
  });
  console.log(`Created ${installedCameras.count} installed_cameras`);

  // Seed counters (20 records)
  const counters = await prisma.counter.createMany({
    data: Array.from({ length: 20 }, (_, i) => {
      const openTime = new Date();
      openTime.setHours(6 + (i % 12), i * 3, 0, 0);
      const closeTime = new Date(openTime);
      closeTime.setMinutes(closeTime.getMinutes() + 30);

      return {
        counter_door_open_datetime: openTime,
        counter_door_close_datetime: closeTime,
        counter_in_count: Math.floor(Math.random() * 50) + 1,
        counter_out_count: Math.floor(Math.random() * 50) + 1,
        counter_bus_id: (i % 20) + 1,
        counter_door_id: (i % 20) + 1,
        counter_installed_camera_id: (i % 20) + 1,
        counter_com_id: (i % 20) + 1,
        counter_busround_id: (i % 20) + 1,
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
