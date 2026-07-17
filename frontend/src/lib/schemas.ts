import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type LoginInput = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type RegisterInput = z.infer<typeof registerSchema>

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  avatar: z.string().url().optional(),
  role: z.enum(['admin', 'user', 'viewer']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type User = z.infer<typeof userSchema>

export const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  avatar: z.string().url().optional(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  slug: z.string(),
  icon: z.string().optional(),
  color: z.string().optional(),
  visibility: z.enum(['private', 'public']),
  owner: userSchema,
  members: z.array(userSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type Project = z.infer<typeof projectSchema>

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100),
  description: z.string().max(500).optional(),
  visibility: z.enum(['private', 'public']).default('private'),
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>

export const issueSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  status: z.enum(['backlog', 'todo', 'in_progress', 'in_review', 'done']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  assignee: userSchema.optional(),
  reporter: userSchema,
  project: projectSchema,
  labels: z.array(z.string()),
  dueDate: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type Issue = z.infer<typeof issueSchema>

export const createIssueSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(5000).optional(),
  status: z.enum(['backlog', 'todo', 'in_progress', 'in_review', 'done']).default('backlog'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  assigneeId: z.string().optional(),
  labels: z.array(z.string()).default([]),
  dueDate: z.string().datetime().optional(),
})

export type CreateIssueInput = z.infer<typeof createIssueSchema>

export const activitySchema = z.object({
  id: z.string(),
  type: z.enum(['created', 'updated', 'commented', 'assigned', 'status_changed']),
  actor: userSchema,
  target: z.object({
    type: z.enum(['issue', 'project', 'comment']),
    id: z.string(),
    title: z.string(),
  }),
  description: z.string(),
  metadata: z.record(z.string(), z.any()).optional(),
  createdAt: z.string().datetime(),
})

export type Activity = z.infer<typeof activitySchema>
