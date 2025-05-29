'use client'

import { useState } from 'react'

import { type MealType as PrismaMealType } from '@prisma/client'

import { useMenuByDate, usePlanner } from '../../model/hooks'
import { type MealWithDetails } from '../../model/types'
import { type MealItemData, MealSection } from './ui'

interface MealTypesListProps {
    selectedDate: string
    onMealSelect: (mealType: string) => void
}

interface MealType {
    id: PrismaMealType
    name: string
    color: string
    items: number
}

const mealTypes: MealType[] = [
    { id: 'breakfast', name: 'Breakfast', color: 'bg-orange-500', items: 0 },
    { id: 'lunch', name: 'Lunch', color: 'bg-blue-500', items: 0 },
    { id: 'dinner', name: 'Dinner', color: 'bg-blue-600', items: 0 },
    { id: 'snack', name: 'Snack', color: 'bg-purple-500', items: 0 },
]

function calculateMealNutrition(meal: Partial<MealWithDetails>) {
    let totalCalories = 0
    let totalProtein = 0
    let totalFat = 0
    let totalCarbs = 0

    meal?.ingredients?.forEach((item) => {
        const quantity = item.quantity
        totalCalories += (item.ingredient.calories * quantity) / 100
        totalProtein += (item.ingredient.protein * quantity) / 100
        totalFat += (item.ingredient.fat * quantity) / 100
        totalCarbs += (item.ingredient.carbs * quantity) / 100
    })

    meal?.recipes?.forEach((item) => {
        const servings = item.servings
        item.recipe.ingredients.forEach((recipeIngredient) => {
            const adjustedQuantity = (recipeIngredient.quantity * servings) / 100
            totalCalories += recipeIngredient.ingredient.calories * adjustedQuantity
            totalProtein += recipeIngredient.ingredient.protein * adjustedQuantity
            totalFat += recipeIngredient.ingredient.fat * adjustedQuantity
            totalCarbs += recipeIngredient.ingredient.carbs * adjustedQuantity
        })
    })

    return {
        calories: Math.round(totalCalories),
        protein: Math.round(totalProtein * 10) / 10,
        fat: Math.round(totalFat * 10) / 10,
        carbs: Math.round(totalCarbs * 10) / 10,
    }
}

export function MealTypesList({ selectedDate, onMealSelect }: MealTypesListProps) {
    const [selectedMeal, setSelectedMeal] = useState<string>('breakfast')
    const { menu, isLoading } = useMenuByDate(selectedDate)
    const planner = usePlanner()

    const getMealData = (mealType: PrismaMealType) => {
        const meal = menu?.meals?.find((m) => m.type === mealType)
        return meal || null
    }

    const getMealItems = (mealType: PrismaMealType): MealItemData[] => {
        const meal = getMealData(mealType)
        if (!meal) return []

        const items: MealItemData[] = []
        const isCompleted = meal.mealTime !== null

        meal.ingredients?.forEach((item) => {
            items.push({
                id: item.ingredientId,
                type: 'ingredient',
                name: item.ingredient.name,
                amount: item.quantity,
                unit: 'g',
                calories: Math.round((item.ingredient.calories * item.quantity) / 100),
                protein: Math.round(((item.ingredient.protein * item.quantity) / 100) * 10) / 10,
                fat: Math.round(((item.ingredient.fat * item.quantity) / 100) * 10) / 10,
                carbs: Math.round(((item.ingredient.carbs * item.quantity) / 100) * 10) / 10,
                completed: isCompleted,
            })
        })

        meal.recipes?.forEach((item) => {
            const nutrition = calculateMealNutrition({ recipes: [item] })
            items.push({
                id: item.recipeId,
                type: 'recipe',
                name: item.recipe.name,
                amount: item.servings,
                unit: 'portion',
                calories: nutrition.calories,
                protein: nutrition.protein,
                fat: nutrition.fat,
                carbs: nutrition.carbs,
                completed: isCompleted,
            })
        })

        return items
    }

    const getUpdatedMealTypes = (): MealType[] => {
        return mealTypes.map((mealType) => {
            const items = getMealItems(mealType.id)
            return {
                ...mealType,
                items: items.length,
            }
        })
    }

    const handleEditItem = async (itemId: string, amount: number) => {
        const meal = getMealData(selectedMeal as PrismaMealType)
        if (!meal) return

        const isRecipe = meal.recipes?.some((r) => r.recipeId === itemId)
        const isIngredient = meal.ingredients?.some((i) => i.ingredientId === itemId)

        if (isRecipe || isIngredient) {
            await planner.updateQuantity.mutate({
                date: selectedDate,
                mealType: selectedMeal as PrismaMealType,
                itemType: isRecipe ? 'recipe' : 'ingredient',
                itemId,
                quantity: amount,
            })
        }
    }

    const handleDeleteItem = async (itemId: string) => {
        const meal = getMealData(selectedMeal as PrismaMealType)
        if (!meal) return

        const isRecipe = meal.recipes?.some((r) => r.recipeId === itemId)
        const isIngredient = meal.ingredients?.some((i) => i.ingredientId === itemId)

        if (isRecipe || isIngredient) {
            await planner.removeItem.mutate({
                date: selectedDate,
                mealType: selectedMeal as PrismaMealType,
                itemType: isRecipe ? 'recipe' : 'ingredient',
                itemId,
            })
        }
    }

    const handleCompleteItem = async (itemId: string) => {
        await planner.toggleMealCompletion.mutate({
            date: selectedDate,
            mealType: selectedMeal as PrismaMealType,
        })
    }

    const handleAddMeal = (mealType: string) => {
        setSelectedMeal(mealType)
        onMealSelect(mealType)
    }

    const handleSelectMeal = (mealId: string) => {
        setSelectedMeal(mealId)
        onMealSelect(mealId)
    }

    if (isLoading) {
        return (
            <div className="space-y-4">
                {mealTypes.map((mealType) => (
                    <div key={mealType.id} className="animate-pulse">
                        <div className="h-16 rounded-lg bg-gray-200"></div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {getUpdatedMealTypes().map((mealType) => (
                <MealSection
                    key={mealType.id}
                    mealType={mealType}
                    items={getMealItems(mealType.id)}
                    isSelected={selectedMeal === mealType.id}
                    onSelect={() => handleSelectMeal(mealType.id)}
                    onEditItem={handleEditItem}
                    onDeleteItem={handleDeleteItem}
                    onCompleteItem={handleCompleteItem}
                    onAddMeal={() => handleAddMeal(mealType.id)}
                />
            ))}
        </div>
    )
}
