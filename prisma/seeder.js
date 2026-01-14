// Seeder script to populate the database with initial data
import prisma from "./client.js";

// Khon Kaen city coordinates
const KHON_KAEN = {
  lat: { min: 16.4, max: 16.48 },
  lng: { min: 102.78, max: 102.88 },
};

function getRandomKhonKaenLocation() {
  return {
    lat: (
      KHON_KAEN.lat.min +
      Math.random() * (KHON_KAEN.lat.max - KHON_KAEN.lat.min)
    )
      .toFixed(6)
      .toString(),
    lng: (
      KHON_KAEN.lng.min +
      Math.random() * (KHON_KAEN.lng.max - KHON_KAEN.lng.min)
    )
      .toFixed(6)
      .toString(),
  };
}

function getRandomDate(daysAgo = 30) {
  const now = new Date();
  const pastDate = new Date(
    now.getTime() - Math.random() * daysAgo * 24 * 60 * 60 * 1000
  );
  return pastDate;
}

async function main() {
  // Seed installed_devices (20 records - 1 device per bus)
  const installedDevices = await prisma.installed_device.createMany({
    data: Array.from({ length: 20 }, (_, i) => ({
      installed_device_name: `Device Bus ${i + 1}`,
      installed_device_uid: `DEV_UID_${String(i + 1).padStart(5, "0")}`,
      installed_bus_id: i + 1,
      installed_com_id: (i % 10) + 1,
      installed_access_key: `ACCESS_KEY_${String(i + 1).padStart(5, "0")}`,
    })),
  });
  console.log(`Created ${installedDevices.count} installed_devices`);

  // Seed counters (100 records - multiple counters per device, all in Khon Kaen)
  const counters = await prisma.counter.createMany({
    data: Array.from({ length: 100 }, (_, i) => {
      const location = getRandomKhonKaenLocation();
      const doorOpenTime = getRandomDate();
      const doorCloseTime = new Date(
        doorOpenTime.getTime() + Math.random() * 5 * 60 * 1000
      ); // 0-5 minutes later
      return {
        counter_in_count: Math.floor(Math.random() * 50) + 1,
        counter_out_count: Math.floor(Math.random() * 50) + 1,
        counter_door_open_datetime: doorOpenTime,
        counter_door_close_datetime: doorCloseTime,
        counter_bus_id: (i % 20) + 1,
        counter_door_number: (i % 3) + 1,
        counter_installed_device_id: (i % 20) + 1,
        counter_com_id: (i % 10) + 1,
        counter_lat: location.lat,
        counter_lng: location.lng,
        counter_busround_id: Math.floor(i / 5) + 1,
      };
    }),
  });
  console.log(`Created ${counters.count} counters`);

  // Seed faces (200 records - multiple faces per counter)
  const genders = ["Male", "Female", "Unknown"];
  const faces = await prisma.face.createMany({
    data: Array.from({ length: 200 }, (_, i) => {
      const faceTimestamp = getRandomDate();
      return {
        counter_id: (i % 100) + 1,
        tracking_id: i + 1,
        gender: genders[Math.floor(Math.random() * 3)],
        age: Math.floor(Math.random() * 60) + 10, // Age 10-70
        gender_confidence: Math.random() * 0.5 + 0.5, // 0.5-1.0
        age_confidence: Math.random() * 0.5 + 0.5, // 0.5-1.0
        timestamp: faceTimestamp,
      };
    }),
  });
  console.log(`Created ${faces.count} faces`);

  // Seed camera_groups (60 records - 3 camera groups per device for 20 devices)
  const cameraGroups = await prisma.camera_group.createMany({
    data: Array.from({ length: 60 }, (_, i) => ({
      camera_group_installed_device_id: (i % 20) + 1,
      camera_group_door_number: String((i % 3) + 1),
      camera_group_camera_status: Math.random() > 0.2 ? 1 : 0, // 80% active
      camera_group_camera_top_uid: `CAM_TOP_${String(i + 1).padStart(5, "0")}`,
      camera_group_camera_face_uid: `CAM_FACE_${String(i + 1).padStart(
        5,
        "0"
      )}`,
    })),
  });
  console.log(`Created ${cameraGroups.count} camera_groups`);

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
