import { z } from "zod";

export const createInstallationSchema = z.object({
  installed_camera_id: z.number().int().positive(),
  installed_bus_id: z.number().int().positive(),
  installed_door_bus_Id: z.number().int().positive(),
  installed_com_id: z.number().int().positive(),
  installed_on_activate: z.boolean().optional().default(true),
  installed_assces_key: z.string().min(1),
});
