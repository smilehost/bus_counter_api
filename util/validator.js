import { z } from "zod";

export const createInstallationSchema = z.object({
  camera_name: z.string().min(1),
  installed_camera_id: z.number().int().positive(),
  bus_id: z.number().int().positive(),
  door_number: z.number().int().positive(),
  installed_bus_id: z.number().int().positive(),
  installed_door_bus_Id: z.number().int().positive(),
  installed_com_id: z.number().int().positive(),
  installed_on_activate: z.boolean().optional().default(true),
  installed_assces_key: z.string().min(1),
});

export const getCountersByDateRangeSchema = z.object({
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use YYYY-MM-DD"),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use YYYY-MM-DD"),
});

export const getCountersByDateSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use YYYY-MM-DD"),
});
