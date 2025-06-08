import { createTRPCRouter, protectedProcedure } from 'shared/lib/trpc/trpc'

import {
    addUnplannedMealToMealSchema,
    createUnplannedMealSchema,
    deleteUnplannedMealSchema,
    getUnplannedMealByIdSchema,
    removeUnplannedMealFromMealSchema,
    updateUnplannedMealSchema,
} from './schemes'

export const unplannedMealRouter = createTRPCRouter({
    getAll: protectedProcedure.query(async ({ ctx }) => {
        const unplannedMeals = await ctx.db.unplannedMeal.findMany({
            orderBy: {
                name: 'asc',
            },
        })

        return {
            status: 200,
            data: {
                unplannedMeals,
            },
        }
    }),

    getById: protectedProcedure.input(getUnplannedMealByIdSchema).query(async ({ ctx, input }) => {
        const unplannedMeal = await ctx.db.unplannedMeal.findUnique({
            where: {
                id: input.id,
            },
        })

        if (!unplannedMeal) {
            throw new Error('Незапланированный прием пищи не найден')
        }

        return {
            status: 200,
            data: {
                unplannedMeal,
            },
        }
    }),

    create: protectedProcedure.input(createUnplannedMealSchema).mutation(async ({ ctx, input }) => {
        const unplannedMeal = await ctx.db.unplannedMeal.create({
            data: input,
        })

        return {
            status: 201,
            data: {
                unplannedMeal,
            },
        }
    }),

    update: protectedProcedure.input(updateUnplannedMealSchema).mutation(async ({ ctx, input }) => {
        const { id, ...updateData } = input

        const unplannedMeal = await ctx.db.unplannedMeal.update({
            where: {
                id,
            },
            data: updateData,
        })

        return {
            status: 200,
            data: {
                unplannedMeal,
            },
        }
    }),

    delete: protectedProcedure.input(deleteUnplannedMealSchema).mutation(async ({ ctx, input }) => {
        await ctx.db.unplannedMeal.delete({
            where: {
                id: input.id,
            },
        })

        return {
            status: 200,
            message: 'Незапланированный прием пищи удален',
        }
    }),

    addToMeal: protectedProcedure.input(addUnplannedMealToMealSchema).mutation(async ({ ctx, input }) => {
        const { date, mealType, unplannedMealId, quantity } = input
        const menuDate = new Date(`${date}T12:00:00.000Z`)

        let menu = await ctx.db.menu.findFirst({
            where: {
                date: {
                    gte: new Date(`${date}T00:00:00.000Z`),
                    lte: new Date(`${date}T23:59:59.999Z`),
                },
                userId: ctx.session.user.id,
            },
            include: {
                meals: true,
            },
        })

        if (!menu) {
            menu = await ctx.db.menu.create({
                data: {
                    date: menuDate,
                    userId: ctx.session.user.id,
                },
                include: {
                    meals: true,
                },
            })
        }

        let meal = menu.meals.find((m) => m.type === mealType)

        if (!meal) {
            const maxSortOrder = menu.meals.length > 0 ? Math.max(...menu.meals.map((m) => m.sortOrder)) : -1

            meal = await ctx.db.meal.create({
                data: {
                    type: mealType,
                    menuId: menu.id,
                    sortOrder: maxSortOrder + 1,
                },
            })
        }

        await ctx.db.mealToUnplannedMeal.upsert({
            where: {
                mealId_unplannedMealId: {
                    mealId: meal.id,
                    unplannedMealId,
                },
            },
            update: {
                quantity,
            },
            create: {
                mealId: meal.id,
                unplannedMealId,
                quantity,
            },
        })

        return {
            status: 200,
            message: 'Незапланированный прием пищи добавлен в прием пищи',
        }
    }),

    removeFromMeal: protectedProcedure.input(removeUnplannedMealFromMealSchema).mutation(async ({ ctx, input }) => {
        const { date, mealType, unplannedMealId } = input

        const menu = await ctx.db.menu.findFirst({
            where: {
                date: {
                    gte: new Date(`${date}T00:00:00.000Z`),
                    lte: new Date(`${date}T23:59:59.999Z`),
                },
                userId: ctx.session.user.id,
            },
            include: {
                meals: true,
            },
        })

        if (!menu) {
            throw new Error('Меню не найдено')
        }

        const meal = menu.meals.find((m) => m.type === mealType)

        if (!meal) {
            throw new Error('Прием пищи не найден')
        }

        await ctx.db.mealToUnplannedMeal.delete({
            where: {
                mealId_unplannedMealId: {
                    mealId: meal.id,
                    unplannedMealId,
                },
            },
        })

        return {
            status: 200,
            message: 'Незапланированный прием пищи удален из приема пищи',
        }
    }),
})
