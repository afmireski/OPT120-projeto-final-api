import { z } from 'zod';

export const stringRelationSchema = z
  .object({
    eq: z.string().optional(),
    ne: z.string().optional(),
    in: z.array(z.string()).optional(),
    nin: z.array(z.string()).optional(),
    like: z.string().optional(),
  })
  .strict();

export const numberRelationSchema = z
  .object({
    eq: z.number().optional(),
    ne: z.number().optional(),
    in: z.array(z.number()).min(1).optional(),
    nin: z.array(z.number()).min(1).optional(),
    gt: z.number().optional(),
    gte: z.number().optional(),
    lt: z.number().optional(),
    lte: z.number().optional(),
  })
  .strict();

export const dateRelationSchema = z
  .object({
    eq: z.string().date().optional(),
    ne: z.string().date().optional(),
    in: z.array(z.string().date()).optional(),
    nin: z.array(z.string().date()).optional(),
    gt: z.string().date().optional(),
    gte: z.string().date().optional(),
    lt: z.string().date().optional(),
    lte: z.string().date().optional(),
  })
  .strict();

export const paginationSchema = z
  .object({
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().default(20),
  })
  .strict();
