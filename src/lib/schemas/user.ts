import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters')
    .optional(),
});

export const UpdateUserSchema = CreateUserSchema.partial().extend({
  id: z.string().uuid('User id must be a valid UUID'),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
