import { z } from 'zod';

export const loginInputSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const registerInputSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.email(),
  password: z.string().min(8).max(200),
});

export const userOutputSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
});

export type LoginInput = z.infer<typeof loginInputSchema>;
export type RegisterInput = z.infer<typeof registerInputSchema>;
export type UserOutput = z.infer<typeof userOutputSchema>;
