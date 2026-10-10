import { z } from 'zod'

const nodeSchema = z.object({
  id: z.string({ required_error: 'Node id is required' }),
  type: z.string().optional().default('default'),
  position: z
    .object({
      x: z.number().default(0),
      y: z.number().default(0),
    })
    .optional()
    .default({ x: 0, y: 0 }),
  data: z.record(z.any()).optional().default({}),
}).passthrough()

const edgeSchema = z.object({
  id: z.string({ required_error: 'Edge id is required' }),
  source: z.string({ required_error: 'Edge source is required' }),
  target: z.string({ required_error: 'Edge target is required' }),
  sourceHandle: z.string().nullable().optional(),
  targetHandle: z.string().nullable().optional(),
}).passthrough()

export const createWorkflowSchema = z.object({
  name: z
    .string({ required_error: 'Workflow name is required' })
    .trim()
    .min(1, 'Workflow name cannot be empty')
    .max(100, 'Workflow name cannot exceed 100 characters'),
  description: z
    .string()
    .trim()
    .max(500, 'Description cannot exceed 500 characters')
    .optional()
    .default(''),
  nodes: z.array(nodeSchema).optional().default([]),
  edges: z.array(edgeSchema).optional().default([]),
  status: z.enum(['draft', 'active', 'inactive']).optional().default('draft'),
  webhookEnabled: z.boolean().optional().default(false),
})

export const updateWorkflowSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Workflow name cannot be empty')
    .max(100, 'Workflow name cannot exceed 100 characters')
    .optional(),
  description: z
    .string()
    .trim()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  nodes: z.array(nodeSchema).optional(),
  edges: z.array(edgeSchema).optional(),
  status: z.enum(['draft', 'active', 'inactive']).optional(),
  webhookEnabled: z.boolean().optional(),
})
