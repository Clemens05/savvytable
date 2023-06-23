import * as z from 'zod';

export const UserSchema = z.object({
  email: z.string(),
  name: z.string(),
  avatar_url: z.string(),
  contact_email: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;
