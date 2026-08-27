import { z } from 'zod';

const locationTupleSchema = z.unknown().transform((val): [number, number] => {
  if (Array.isArray(val) && val.length === 2) {
    return [Number(val[0]), Number(val[1])];
  }
  if (typeof val === 'object' && val !== null && 'x' in val && 'y' in val) {
    return [Number((val as any).x), Number((val as any).y)];
  }
  if (typeof val === 'object' && val !== null && 'lng' in val && 'lat' in val) {
    return [Number((val as any).lat), Number((val as any).lng)];
  }
  return [0, 0];
});

export const parkImageOutputSchema = z.object({
  id: z.uuid(),
  url: z.url(),
  caption: z.string().nullable(),
});

export const parkOutputSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string().nullable(),
  openedAt: z.union([z.date(), z.string()]).nullable(),
  location: locationTupleSchema,
  polygon: z
    .unknown()
    .transform((val) =>
      typeof val === 'string' ? val : val ? JSON.stringify(val) : null,
    ),
  cityName: z.string(),
  regionName: z.string(),
});

export const parkDetailOutputSchema = parkOutputSchema.extend({
  images: z.array(parkImageOutputSchema),
});

export const parkListOutputSchema = z.array(parkOutputSchema);

export const getParksInputSchema = z
  .object({
    cityId: z.uuid().optional(),
    regionId: z.uuid().optional(),
  })
  .optional();

export const getParkByIdInputSchema = z.object({
  id: z.uuid(),
});

export const createParkImageInputSchema = z.object({
  url: z.url(),
  caption: z.string().trim().min(1).max(280).optional(),
});

export const createParkInputSchema = z.object({
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(2000).optional(),
  creatorId: z.uuid(),
  openedAt: z.coerce.date().optional(),
  cityId: z.uuid(),
  location: z.unknown().optional(),
  polygon: z.unknown().optional(),
  images: z.array(createParkImageInputSchema).max(10).optional(),
});

export const updateParkInputSchema = createParkInputSchema
  .omit({ creatorId: true })
  .partial();

export type ParkImageOutput = z.infer<typeof parkImageOutputSchema>;
export type ParkOutput = z.infer<typeof parkOutputSchema>;
export type ParkDetailOutput = z.infer<typeof parkDetailOutputSchema>;
export type GetParksInput = z.infer<typeof getParksInputSchema>;
export type GetParkByIdInput = z.infer<typeof getParkByIdInputSchema>;
export type CreateParkInput = z.infer<typeof createParkInputSchema>;
export type UpdateParkInput = z.infer<typeof updateParkInputSchema>;
