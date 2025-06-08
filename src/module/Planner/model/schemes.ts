import { z } from 'zod'

export const mealTypeEnum = z.enum(['breakfast', 'lunch', 'dinner', 'snack'])

export const itemTypeEnum = z.enum(['recipe', 'ingredient', 'unplannedMeal'])

export const getMenuByDateSchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
})

export const addItemToMealSchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    mealType: mealTypeEnum,
    itemType: itemTypeEnum,
    itemId: z.string().uuid('Item ID must be a valid UUID'),
    quantity: z.number().positive('Quantity must be a positive number'),
})

export const removeItemFromMealSchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    mealType: mealTypeEnum,
    itemType: itemTypeEnum,
    itemId: z.string().uuid('Item ID must be a valid UUID'),
})

export const updateItemQuantitySchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    mealType: mealTypeEnum,
    itemType: itemTypeEnum,
    itemId: z.string().uuid('Item ID must be a valid UUID'),
    quantity: z.number().positive('Quantity must be a positive number'),
})

export const toggleMealCompletionSchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    mealType: mealTypeEnum,
})

export const updateMealOrderSchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    mealType: mealTypeEnum,
    newSortOrder: z.number().int().min(0),
})

export const createMealSchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    mealType: mealTypeEnum,
})

export const updateMealTimeSchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    mealType: mealTypeEnum,
    mealTime: z.date(),
})
