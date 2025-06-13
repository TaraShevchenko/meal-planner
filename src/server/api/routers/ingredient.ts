import { z } from 'zod';
import {
  createTRPCRouter,
  protectedProcedure,
} from '~/server/api/trpc';

export const ingredientRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.ingredient.findMany({
      orderBy: { name: 'asc' },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.ingredient.findUnique({
        where: { id: input.id },
      });
    }),

  searchByName: protectedProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.ingredient.findMany({
        where: {
          name: {
            contains: input.query,
            mode: 'insensitive',
          },
        },
        orderBy: { name: 'asc' },
        take: 20,
      });
    }),

  getByCategory: protectedProcedure
    .input(z.object({ category: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.ingredient.findMany({
        where: { category: input.category },
        orderBy: { name: 'asc' },
      });
    }),

  getCategories: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.ingredient.findMany({
      select: { category: true },
      distinct: ['category'],
      where: {
        category: {
          not: null,
        },
      },
      orderBy: { category: 'asc' },
    });

    return result
      .map(item => item.category)
      .filter((category): category is string => category !== null);
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        category: z.string().optional(),
        defaultUnit: z.string().default('г'),
        caloriesPer100g: z.number().min(0),
        proteinsPer100g: z.number().min(0),
        fatsPer100g: z.number().min(0),
        carbsPer100g: z.number().min(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.ingredient.create({
        data: input,
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        category: z.string().optional(),
        defaultUnit: z.string().optional(),
        caloriesPer100g: z.number().min(0).optional(),
        proteinsPer100g: z.number().min(0).optional(),
        fatsPer100g: z.number().min(0).optional(),
        carbsPer100g: z.number().min(0).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.ingredient.update({
        where: { id },
        data,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.ingredient.delete({
        where: { id: input.id },
      });
    }),
});