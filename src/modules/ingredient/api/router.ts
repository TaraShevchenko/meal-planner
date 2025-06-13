import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/shared/api/trpc';

export const ingredientRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.ingredient.findMany({
      orderBy: { name: 'asc' },
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const ingredient = await ctx.db.ingredient.findUnique({
        where: { id: input.id },
      });

      if (!ingredient) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Ингредиент не найден',
        });
      }

      return ingredient;
    }),

  searchByName: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.ingredient.findMany({
        where: {
          name: {
            contains: input.name,
            mode: 'insensitive',
          },
        },
        orderBy: { name: 'asc' },
        take: 20,
      });
    }),

  getByCategory: publicProcedure
    .input(z.object({ category: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.ingredient.findMany({
        where: { category: input.category },
        orderBy: { name: 'asc' },
      });
    }),

  getCategories: publicProcedure.query(async ({ ctx }) => {
    const categories = await ctx.db.ingredient.findMany({
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });

    return categories.map(c => c.category).filter(Boolean);
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        category: z.string().optional(),
        caloriesPer100g: z.number().min(0),
        proteinsPer100g: z.number().min(0),
        fatsPer100g: z.number().min(0),
        carbsPer100g: z.number().min(0),
        fiberPer100g: z.number().min(0).optional(),
        sugarPer100g: z.number().min(0).optional(),
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
        caloriesPer100g: z.number().min(0).optional(),
        proteinsPer100g: z.number().min(0).optional(),
        fatsPer100g: z.number().min(0).optional(),
        carbsPer100g: z.number().min(0).optional(),
        fiberPer100g: z.number().min(0).optional(),
        sugarPer100g: z.number().min(0).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      const ingredient = await ctx.db.ingredient.findUnique({
        where: { id },
      });

      if (!ingredient) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Ингредиент не найден',
        });
      }

      return ctx.db.ingredient.update({
        where: { id },
        data: updateData,
      });
    }),
});