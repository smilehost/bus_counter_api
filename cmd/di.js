import {
  createContainer,
  asClass,
  asValue,
  asFunction,
  Lifetime,
} from "awilix";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ฟังก์ชันสำหรับ Initialize Container
const initContainer = async () => {
  const container = createContainer();

  //   ถ้าต้องการใช้ ค่าคงที่ใน container
  container.register({
    currentUser: asFunction(() => null).scoped(),
  });

  await container.loadModules(["../domain/**/*.js"], {
    cwd: __dirname,
    formatName: "camelCase", // bus.service.js -> busService
    esModules: true,
    resolverOptions: {
      lifetime: Lifetime.SCOPED,
      register: asClass, // โหลดเป็น Class
    },
  });

  return container;
};

export default initContainer;
