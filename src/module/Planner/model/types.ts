import { type MealType, type Prisma } from '@prisma/client'

export type MealWithDetails = Prisma.MealGetPayload<{
    include: {
        recipes: {
            include: {
                recipe: {
                    include: {
                        ingredients: {
                            include: {
                                ingredient: true
                            }
                        }
                    }
                }
            }
        }
        ingredients: {
            include: {
                ingredient: true
            }
        }
    }
}>

export type MenuWithMeals = Prisma.MenuGetPayload<{
    include: {
        meals: {
            include: {
                recipes: {
                    include: {
                        recipe: {
                            include: {
                                ingredients: {
                                    include: {
                                        ingredient: true
                                    }
                                }
                            }
                        }
                    }
                }
                ingredients: {
                    include: {
                        ingredient: true
                    }
                }
            }
        }
    }
}>

export type MealItemData = {
    id: string
    type: 'ingredient' | 'recipe'
    name: string
    amount: number
    unit: string
    calories: number
    protein: number
    fat: number
    carbs: number
}

export type MealTypeConfig = {
    type: string
    name: string
    color: string
    defaultSortOrder: number
}

export type AddItemToMealData = {
    date: string
    mealType: MealType
    itemType: 'recipe' | 'ingredient'
    itemId: string
    quantity: number
}

export type RemoveItemFromMealData = {
    date: string
    mealType: MealType
    itemType: 'recipe' | 'ingredient'
    itemId: string
}

export type ToggleMealCompletionData = {
    date: string
    mealType: MealType
}

export type UpdateMealOrderData = {
    date: string
    mealType: MealType
    newSortOrder: number
}

export type CreateMealData = {
    date: string
    mealType: MealType
}

export type UpdateMealTimeData = {
    date: string
    mealType: MealType
    mealTime: Date
}

export type PlannerHeaderProps = {
    selectedDate: Date
    onDateChange: (date: Date) => void
}
