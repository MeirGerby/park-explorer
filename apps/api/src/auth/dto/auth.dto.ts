import { z } from 'zod';

export const loginInputSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const userOutputSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
});

export type LoginInput = z.infer<typeof loginInputSchema>;
export type UserOutput = z.infer<typeof userOutputSchema>;
