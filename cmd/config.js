import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Prisma configuration file
export default defineConfig({
  schema: "../prisma/schema.prisma",
  migrations: {
    path: "../prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
