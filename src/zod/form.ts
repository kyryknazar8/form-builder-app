import { z } from 'zod';


const baseOptions = z.object({
  label: z.string().min(1, 'label is required'),
  placeholder: z.string().optional(),
  required: z.boolean().default(false)
});

const textOptions = baseOptions.extend({
  minLength: z.number().int().min(0).optional(),
  maxLength: z.number().int().min(1).optional()
});

const numberOptions = baseOptions.extend({
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().positive().optional()
});

const textareaOptions = baseOptions.extend({
  minLength: z.number().int().min(0).optional(),
  maxLength: z.number().int().min(1).optional(),
  rows: z.number().int().min(1).default(3)
});

export const fieldSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('text'),
    key: z.string().min(1),
    options: textOptions
  }),
  z.object({
    type: z.literal('number'),
    key: z.string().min(1),
    options: numberOptions
  }),
  z.object({
    type: z.literal('textarea'),
    key: z.string().min(1),
    options: textareaOptions
  })
]);

export type FieldInput = z.infer<typeof fieldSchema>;

export const formCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  published: z.boolean().optional().default(false),
  fields: z.array(fieldSchema).default([])
});

export const formUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/).optional(),
  published: z.boolean().optional(),
  fields: z.array(fieldSchema).optional()
});

export const submissionCreateSchema = z.object({
  formId: z.string().min(1),
  data: z.record(z.string(), z.any())
});
