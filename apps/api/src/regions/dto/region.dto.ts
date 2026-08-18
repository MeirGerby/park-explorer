import { z } from 'zod';

export const regionCityOutputSchema = z.object({
  id: z.uuid(),
  name: z.string(),
});

export const regionOutputSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  createdAt: z.date(),
});

export const regionDetailOutputSchema = regionOutputSchema.extend({
  cities: z.array(regionCityOutputSchema),
});

export const regionListOutputSchema = z.array(regionOutputSchema);

export const getRegionByIdInputSchema = z.object({
  id: z.uuid(),
});

export const createRegionInputSchema = z.object({
  name: z.string().trim().min(1).max(100),
});

export type RegionOutput = z.infer<typeof regionOutputSchema>;
export type RegionDetailOutput = z.infer<typeof regionDetailOutputSchema>;
export type GetRegionByIdInput = z.infer<typeof getRegionByIdInputSchema>;
export type CreateRegionInput = z.infer<typeof createRegionInputSchema>;
