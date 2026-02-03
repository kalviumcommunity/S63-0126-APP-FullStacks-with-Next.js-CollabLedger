import { z } from 'zod';

export const ProjectStatusSchema = z.enum([
  'IDEA',
  'IN_PROGRESS',
  'COMPLETED',
]);

export const CreateProjectSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(120, 'Title must be at most 120 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be at most 1000 characters'),
  ownerId: z.string().uuid('Owner id must be a valid UUID'),
  status: ProjectStatusSchema.optional(),
});

export const UpdateProjectSchema = CreateProjectSchema.partial().extend({
  id: z.string().uuid('Project id must be a valid UUID'),
});

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;
