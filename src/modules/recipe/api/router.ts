import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import {
  createTRPCRouter,
  protectedProcedure,
} from '~/shared/api/trpc';

export const recipeRouter = createTRPCRouter({
  getFamilyRecipes: protectedProcedure
    .input(z.object({ familyId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Проверяем доступ к семье
      const familyMember = await ctx.db.familyMember.findUnique({
        where: {
          familyId_userId: {
            familyId: input.familyId,
            userId: ctx.session.user.id,
          },
        },
      });

      if (!familyMember) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Вы не являетесь членом этой семьи',
        });
      }

      return ctx.db.recipe.findMany({
        where: { familyId: input.familyId },
        orderBy: { name: 'asc' },
      });
    }),

  getRecipeById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const recipe = await ctx.db.recipe.findUnique({
        where: { id: input.id },
      });

      if (!recipe) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Рецепт не найден',
        });
      }

      // Проверяем доступ к семье
      const familyMember = await ctx.db.familyMember.findUnique({
        where: {
          familyId_userId: {
            familyId: recipe.familyId,
            userId: ctx.session.user.id,
          },
        },
      });

      if (!familyMember) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Вы не имеете доступа к этому рецепту',
        });
      }

      return recipe;
    }),

  getRecipeWithIngredients: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const recipe = await ctx.db.recipe.findUnique({
        where: { id: input.id },
        include: {
          ingredients: {
            include: {
              ingredient: true,
            },
          },
        },
      });

      if (!recipe) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Рецепт не найден',
        });
      }

      // Проверяем доступ к семье
      const familyMember = await ctx.db.familyMember.findUnique({
        where: {
          familyId_userId: {
            familyId: recipe.familyId,
            userId: ctx.session.user.id,
          },
        },
      });

      if (!familyMember) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Вы не имеете доступа к этому рецепту',
        });
      }

      return recipe;
    }),

  getQuickMeals: protectedProcedure
    .input(z.object({ familyId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Проверяем доступ к семье
      const familyMember = await ctx.db.familyMember.findUnique({
        where: {
          familyId_userId: {
            familyId: input.familyId,
            userId: ctx.session.user.id,
          },
        },
      });

      if (!familyMember) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Вы не являетесь членом этой семьи',
        });
      }

      return ctx.db.recipe.findMany({
        where: {
          familyId: input.familyId,
          isQuickMeal: true,
        },
        orderBy: { name: 'asc' },
      });
    }),

  searchRecipes: protectedProcedure
    .input(
      z.object({
        familyId: z.string(),
        query: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Проверяем доступ к семье
      const familyMember = await ctx.db.familyMember.findUnique({
        where: {
          familyId_userId: {
            familyId: input.familyId,
            userId: ctx.session.user.id,
          },
        },
      });

      if (!familyMember) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Вы не являетесь членом этой семьи',
        });
      }

      return ctx.db.recipe.findMany({
        where: {
          familyId: input.familyId,
          OR: [
            {
              name: {
                contains: input.query,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: input.query,
                mode: 'insensitive',
              },
            },
          ],
        },
        orderBy: { name: 'asc' },
        take: 20,
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        familyId: z.string(),
        name: z.string().min(1),
        description: z.string().optional(),
        servings: z.number().min(1).default(1),
        cookingTime: z.number().min(0).optional(),
        instructions: z.string().optional(),
        isQuickMeal: z.boolean().default(false),
        ingredients: z.array(
          z.object({
            ingredientId: z.string(),
            amount: z.number().min(0),
            unit: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Проверяем доступ к семье
      const familyMember = await ctx.db.familyMember.findUnique({
        where: {
          familyId_userId: {
            familyId: input.familyId,
            userId: ctx.session.user.id,
          },
        },
      });

      if (!familyMember) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Вы не являетесь членом этой семьи',
        });
      }

      const { ingredients, ...recipeData } = input;

      return ctx.db.recipe.create({
        data: {
          ...recipeData,
          ingredients: {
            create: ingredients,
          },
        },
        include: {
          ingredients: {
            include: {
              ingredient: true,
            },
          },
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        servings: z.number().min(1).optional(),
        cookingTime: z.number().min(0).optional(),
        instructions: z.string().optional(),
        isQuickMeal: z.boolean().optional(),
        ingredients: z
          .array(
            z.object({
              ingredientId: z.string(),
              amount: z.number().min(0),
              unit: z.string(),
            })
          )
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ingredients, ...updateData } = input;

      // Проверяем существование рецепта и доступ
      const recipe = await ctx.db.recipe.findUnique({
        where: { id },
      });

      if (!recipe) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Рецепт не найден',
        });
      }

      const familyMember = await ctx.db.familyMember.findUnique({
        where: {
          familyId_userId: {
            familyId: recipe.familyId,
            userId: ctx.session.user.id,
          },
        },
      });

      if (!familyMember) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Вы не имеете доступа к этому рецепту',
        });
      }

      // Обновляем рецепт
      const updatedRecipe = await ctx.db.recipe.update({
        where: { id },
        data: updateData,
      });

      // Если переданы ингредиенты, обновляем их
      if (ingredients) {
        // Удаляем старые ингредиенты
        await ctx.db.recipeIngredient.deleteMany({
          where: { recipeId: id },
        });

        // Создаем новые
        await ctx.db.recipeIngredient.createMany({
          data: ingredients.map(ing => ({
            recipeId: id,
            ...ing,
          })),
        });
      }

      return ctx.db.recipe.findUnique({
        where: { id },
        include: {
          ingredients: {
            include: {
              ingredient: true,
            },
          },
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Проверяем существование рецепта и доступ
      const recipe = await ctx.db.recipe.findUnique({
        where: { id: input.id },
      });

      if (!recipe) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Рецепт не найден',
        });
      }

      const familyMember = await ctx.db.familyMember.findUnique({
        where: {
          familyId_userId: {
            familyId: recipe.familyId,
            userId: ctx.session.user.id,
          },
        },
      });

      if (!familyMember) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Вы не имеете доступа к этому рецепту',
        });
      }

      return ctx.db.recipe.delete({
        where: { id: input.id },
      });
    }),
});