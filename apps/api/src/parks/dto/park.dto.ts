import { z } from 'zod';

export const parkOutputSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  cityName: z.string(),
  regionName: z.string(),
});

export const parkListOutputSchema = z.array(parkOutputSchema)

export type ParkOutput = z.infer<typeof parkOutputSchema>
