import { createTRPCRouter, protectedProcedure } from 'shared/lib/trpc/trpc'

import {
    addItemToMealSchema,
    createMealSchema,
    getMenuByDateSchema,
    removeItemFromMealSchema,
    toggleMealCompletionSchema,
    updateItemQuantitySchema,
    updateMealOrderSchema,
    updateMealTimeSchema,
} from './schemes'

export const plannerRouter = createTRPCRouter({
    getIngredients: protectedProcedure.query(async ({ ctx }) => {
        const ingredients = await ctx.db.ingredients.findMany({
            orderBy: {
                name: 'asc',
            },
        })

        return {
            status: 200,
            data: {
                ingredients,
            },
        }
    }),

    getRecipes: protectedProcedure.query(async ({ ctx }) => {
        const recipes = await ctx.db.recipe.findMany({
            include: {
                ingredients: {
                    include: {
                        ingredient: true,
                    },
                },
            },
            orderBy: {
                name: 'asc',
            },
        })

        return {
            status: 200,
            data: {
                recipes,
            },
        }
    }),

    getMenuByDate: protectedProcedure.input(getMenuByDateSchema).query(async ({ ctx, input }) => {
        const { date } = input
        const startOfDay = new Date(`${date}T00:00:00.000Z`)
        const endOfDay = new Date(`${date}T23:59:59.999Z`)

        const menu = await ctx.db.menu.findFirst({
            where: {
                date: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
                userId: ctx.session.user.id,
            },
            include: {
                meals: {
                    include: {
                        recipes: {
                            include: {
                                recipe: {
                                    include: {
                                        ingredients: {
                                            include: {
                                                ingredient: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        ingredients: {
                            include: {
                                ingredient: true,
                            },
                        },
                    },
                    orderBy: [{ mealTime: { sort: 'asc', nulls: 'last' } }, { sortOrder: 'asc' }],
                },
            },
        })

        return {
            status: 200,
            data: {
                menu,
            },
        }
    }),

    addItemToMeal: protectedProcedure.input(addItemToMealSchema).mutation(async ({ ctx, input }) => {
        const { date, mealType, itemType, itemId, quantity } = input
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
            // Определяем sortOrder как последний элемент в списке (единообразно с createMeal)
            const maxSortOrder = menu.meals.length > 0 ? Math.max(...menu.meals.map((m) => m.sortOrder)) : -1

            meal = await ctx.db.meal.create({
                data: {
                    type: mealType,
                    menuId: menu.id,
                    sortOrder: maxSortOrder + 1,
                    // mealTime НЕ устанавливается - это поле для отметки выполнения приема пищи
                },
            })
        }

        if (itemType === 'recipe') {
            await ctx.db.mealToRecipe.upsert({
                where: {
                    mealId_recipeId: {
                        mealId: meal.id,
                        recipeId: itemId,
                    },
                },
                update: {
                    servings: quantity,
                },
                create: {
                    mealId: meal.id,
                    recipeId: itemId,
                    servings: quantity,
                },
            })
        } else if (itemType === 'ingredient') {
            await ctx.db.mealToIngredients.upsert({
                where: {
                    mealId_ingredientId: {
                        mealId: meal.id,
                        ingredientId: itemId,
                    },
                },
                update: {
                    quantity,
                },
                create: {
                    mealId: meal.id,
                    ingredientId: itemId,
                    quantity,
                },
            })
        } else if (itemType === 'unplannedMeal') {
            await ctx.db.mealToUnplannedMeal.upsert({
                where: {
                    mealId_unplannedMealId: {
                        mealId: meal.id,
                        unplannedMealId: itemId,
                    },
                },
                update: {
                    quantity,
                },
                create: {
                    mealId: meal.id,
                    unplannedMealId: itemId,
                    quantity,
                },
            })
        }

        const updatedMenu = await ctx.db.menu.findFirst({
            where: {
                id: menu.id,
                userId: ctx.session.user.id,
            },
            include: {
                meals: {
                    include: {
                        recipes: {
                            include: {
                                recipe: {
                                    include: {
                                        ingredients: {
                                            include: {
                                                ingredient: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        ingredients: {
                            include: {
                                ingredient: true,
                            },
                        },
                    },
                },
            },
        })

        return {
            status: 200,
            data: {
                menu: updatedMenu,
            },
        }
    }),

    removeItemFromMeal: protectedProcedure.input(removeItemFromMealSchema).mutation(async ({ ctx, input }) => {
        const { date, mealType, itemType, itemId } = input

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
            throw new Error('Menu not found')
        }

        const meal = menu.meals.find((m) => m.type === mealType)

        if (!meal) {
            throw new Error('Meal not found')
        }

        if (itemType === 'recipe') {
            await ctx.db.mealToRecipe.delete({
                where: {
                    mealId_recipeId: {
                        mealId: meal.id,
                        recipeId: itemId,
                    },
                },
            })
        } else {
            await ctx.db.mealToIngredients.delete({
                where: {
                    mealId_ingredientId: {
                        mealId: meal.id,
                        ingredientId: itemId,
                    },
                },
            })
        }

        const updatedMenu = await ctx.db.menu.findFirst({
            where: {
                id: menu.id,
                userId: ctx.session.user.id,
            },
            include: {
                meals: {
                    include: {
                        recipes: {
                            include: {
                                recipe: {
                                    include: {
                                        ingredients: {
                                            include: {
                                                ingredient: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        ingredients: {
                            include: {
                                ingredient: true,
                            },
                        },
                    },
                },
            },
        })

        return {
            status: 200,
            data: {
                menu: updatedMenu,
            },
        }
    }),

    updateItemQuantity: protectedProcedure.input(updateItemQuantitySchema).mutation(async ({ ctx, input }) => {
        const { date, mealType, itemType, itemId, quantity } = input

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
            throw new Error('Menu not found')
        }

        const meal = menu.meals.find((m) => m.type === mealType)

        if (!meal) {
            throw new Error('Meal not found')
        }

        if (itemType === 'recipe') {
            await ctx.db.mealToRecipe.update({
                where: {
                    mealId_recipeId: {
                        mealId: meal.id,
                        recipeId: itemId,
                    },
                },
                data: {
                    servings: quantity,
                },
            })
        } else {
            await ctx.db.mealToIngredients.update({
                where: {
                    mealId_ingredientId: {
                        mealId: meal.id,
                        ingredientId: itemId,
                    },
                },
                data: {
                    quantity,
                },
            })
        }

        const updatedMenu = await ctx.db.menu.findFirst({
            where: {
                id: menu.id,
                userId: ctx.session.user.id,
            },
            include: {
                meals: {
                    include: {
                        recipes: {
                            include: {
                                recipe: {
                                    include: {
                                        ingredients: {
                                            include: {
                                                ingredient: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        ingredients: {
                            include: {
                                ingredient: true,
                            },
                        },
                    },
                },
            },
        })

        return {
            status: 200,
            data: {
                menu: updatedMenu,
            },
        }
    }),

    toggleMealCompletion: protectedProcedure.input(toggleMealCompletionSchema).mutation(async ({ ctx, input }) => {
        const { date, mealType } = input

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
            throw new Error('Menu not found')
        }

        const meal = menu.meals.find((m) => m.type === mealType)

        if (!meal) {
            throw new Error('Meal not found')
        }

        const now = new Date()
        const mealTime = new Date(menu.date)
        mealTime.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds())

        const isCurrentlyCompleted = meal.mealTime !== null

        await ctx.db.meal.update({
            where: {
                id: meal.id,
            },
            data: {
                mealTime: isCurrentlyCompleted ? null : mealTime,
            },
        })

        const updatedMenu = await ctx.db.menu.findFirst({
            where: {
                id: menu.id,
                userId: ctx.session.user.id,
            },
            include: {
                meals: {
                    include: {
                        recipes: {
                            include: {
                                recipe: {
                                    include: {
                                        ingredients: {
                                            include: {
                                                ingredient: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        ingredients: {
                            include: {
                                ingredient: true,
                            },
                        },
                    },
                },
            },
        })

        return {
            status: 200,
            data: {
                menu: updatedMenu,
            },
        }
    }),

    updateMealOrder: protectedProcedure.input(updateMealOrderSchema).mutation(async ({ ctx, input }) => {
        const { date, mealType, newSortOrder } = input

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
            throw new Error('Menu not found')
        }

        const meal = menu.meals.find((m) => m.type === mealType)

        if (!meal) {
            throw new Error('Meal not found')
        }

        await ctx.db.meal.update({
            where: {
                id: meal.id,
            },
            data: {
                sortOrder: newSortOrder,
            },
        })

        const updatedMenu = await ctx.db.menu.findFirst({
            where: {
                id: menu.id,
                userId: ctx.session.user.id,
            },
            include: {
                meals: {
                    include: {
                        recipes: {
                            include: {
                                recipe: {
                                    include: {
                                        ingredients: {
                                            include: {
                                                ingredient: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        ingredients: {
                            include: {
                                ingredient: true,
                            },
                        },
                    },
                    orderBy: [{ mealTime: { sort: 'asc', nulls: 'last' } }, { sortOrder: 'asc' }],
                },
            },
        })

        return {
            status: 200,
            data: {
                menu: updatedMenu,
            },
        }
    }),

    createMeal: protectedProcedure.input(createMealSchema).mutation(async ({ ctx, input }) => {
        const { date, mealType } = input
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

        const existingMeal = menu.meals.find((m) => m.type === mealType)
        if (existingMeal) {
            return {
                status: 200,
                data: {
                    mealId: existingMeal.id,
                    message: 'Meal already exists',
                },
            }
        }

        // Определяем sortOrder как последний элемент в списке
        const maxSortOrder = menu.meals.length > 0 ? Math.max(...menu.meals.map((m) => m.sortOrder)) : -1

        const meal = await ctx.db.meal.create({
            data: {
                type: mealType,
                menuId: menu.id,
                sortOrder: maxSortOrder + 1,
                // mealTime НЕ устанавливается - это поле для отметки выполнения приема пищи
            },
        })

        const updatedMenu = await ctx.db.menu.findFirst({
            where: {
                id: menu.id,
                userId: ctx.session.user.id,
            },
            include: {
                meals: {
                    include: {
                        recipes: {
                            include: {
                                recipe: {
                                    include: {
                                        ingredients: {
                                            include: {
                                                ingredient: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        ingredients: {
                            include: {
                                ingredient: true,
                            },
                        },
                    },
                    orderBy: [{ mealTime: { sort: 'asc', nulls: 'last' } }, { sortOrder: 'asc' }],
                },
            },
        })

        return {
            status: 200,
            data: {
                mealId: meal.id,
                menu: updatedMenu,
            },
        }
    }),

    updateMealTime: protectedProcedure.input(updateMealTimeSchema).mutation(async ({ ctx, input }) => {
        const { date, mealType, mealTime } = input

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
            throw new Error('Menu not found')
        }

        const meal = menu.meals.find((m) => m.type === mealType)

        if (!meal) {
            throw new Error('Meal not found')
        }

        const updatedMealTime = new Date(menu.date)
        updatedMealTime.setHours(
            mealTime.getHours(),
            mealTime.getMinutes(),
            mealTime.getSeconds(),
            mealTime.getMilliseconds(),
        )

        await ctx.db.meal.update({
            where: {
                id: meal.id,
            },
            data: {
                mealTime: updatedMealTime,
            },
        })

        const updatedMenu = await ctx.db.menu.findFirst({
            where: {
                id: menu.id,
                userId: ctx.session.user.id,
            },
            include: {
                meals: {
                    include: {
                        recipes: {
                            include: {
                                recipe: {
                                    include: {
                                        ingredients: {
                                            include: {
                                                ingredient: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        ingredients: {
                            include: {
                                ingredient: true,
                            },
                        },
                    },
                    orderBy: [{ mealTime: { sort: 'asc', nulls: 'last' } }, { sortOrder: 'asc' }],
                },
            },
        })

        return {
            status: 200,
            data: {
                menu: updatedMenu,
            },
        }
    }),
})
