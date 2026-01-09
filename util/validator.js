import { z } from "zod";

// ==================== Installed Device ====================
const cameraGroupInputSchema = z.object({
  door_num: z.string().min(1),
  camera_top_uid: z.string().min(1),
  camera_face_uid: z.string().min(1),
});

export const createInstalledDeviceSchema = z.object({
  device_name: z.string().min(1),
  device_uid: z.string().min(1),
  bus_id: z.number().int().positive(),
  com_id: z.number().int().positive(),
  cameras_group: z.array(cameraGroupInputSchema).optional(),
});

export const updateInstalledDeviceSchema = z.object({
  device_name: z.string().min(1).optional(),
  device_uid: z.string().min(1).optional(),
  bus_id: z.number().int().positive().optional(),
  com_id: z.number().int().positive().optional(),
});

// ==================== Camera Group ====================
export const createCameraGroupSchema = z.object({
  camera_group_installed_device_id: z.number().int().positive(),
  camera_group_door_number: z.string().min(1),
  camera_group_camera_status: z.number().int().min(0).max(1),
  camera_group_camera_top_uid: z.string().min(1),
  camera_group_camera_face_uid: z.string().min(1),
});

export const updateCameraGroupSchema = z.object({
  camera_group_installed_device_id: z.number().int().positive().optional(),
  camera_group_door_number: z.string().min(1).optional(),
  camera_group_camera_status: z.number().int().min(0).max(1).optional(),
  camera_group_camera_top_uid: z.string().min(1).optional(),
  camera_group_camera_face_uid: z.string().min(1).optional(),
});

// ==================== Counter ====================
export const createCounterSchema = z.object({
  counter_in_count: z.number().int().min(0),
  counter_out_count: z.number().int().min(0),
  counter_door_open_datetime: z.string().datetime().optional(),
  counter_door_close_datetime: z.string().datetime().optional(),
  counter_bus_id: z.number().int().positive(),
  counter_door_number: z.number().int().positive(),
  counter_installed_device_id: z.number().int().positive(),
  counter_com_id: z.number().int().positive(),
  counter_lat: z.string(),
  counter_lng: z.string(),
  counter_busround_id: z.number().int().positive().optional(),
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
