'use client'

import { useState } from 'react'

import { type MealType as PrismaMealType } from '@prisma/client'

import { CardContent, CardHeader } from 'shared/ui/Card'
import { Card } from 'shared/ui/Card'
import { PieChart } from 'shared/ui/PieChart'
import { Text } from 'shared/ui/Text'

import { getMealTypeConfig } from '../../model/config'
import { useMenuByDate, usePlanner } from '../../model/hooks'
import { type MealWithDetails, type MenuWithMeals } from '../../model/types'
import { MealCreator, type MealItemData, MealSection } from './ui'

interface MealTypesListProps {
    selectedDate: string
    onMealSelect: (mealId: string) => void
}

interface MealType {
    id: string
    type: PrismaMealType
    name: string
    color: string
    items: number
}

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

function calculateDayNutrition(menu: MenuWithMeals | null) {
    let totalCalories = 0
    let totalProtein = 0
    let totalFat = 0
    let totalCarbs = 0

    menu?.meals?.forEach((meal) => {
        const mealNutrition = calculateMealNutrition(meal)
        totalCalories += mealNutrition.calories
        totalProtein += mealNutrition.protein
        totalFat += mealNutrition.fat
        totalCarbs += mealNutrition.carbs
    })

    return {
        calories: Math.round(totalCalories),
        protein: Math.round(totalProtein * 10) / 10,
        fat: Math.round(totalFat * 10) / 10,
        carbs: Math.round(totalCarbs * 10) / 10,
    }
}

export function MealTypesList({ selectedDate, onMealSelect }: MealTypesListProps) {
    const [selectedMeal, setSelectedMeal] = useState<string | null>(null)
    const [expandedMeals, setExpandedMeals] = useState<Set<string>>(new Set())
    const { menu } = useMenuByDate(selectedDate)
    const planner = usePlanner()

    const getMealData = (mealId: string) => {
        const meal = menu?.meals?.find((m) => m.id === mealId)
        return meal || null
    }

    const getMealCompletedTime = (mealId: string) => {
        const meal = getMealData(mealId)
        return meal?.mealTime
    }

    const getMealItems = (mealId: string): MealItemData[] => {
        const meal = getMealData(mealId)
        if (!meal) return []

        const items: MealItemData[] = []

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
            })
        })

        return items
    }

    const getUpdatedMeals = (): MealType[] => {
        if (!menu?.meals) return []

        return menu.meals
            .sort((a, b) => {
                if (a.mealTime && b.mealTime) {
                    return a.mealTime.getTime() - b.mealTime.getTime()
                }
                if (a.mealTime && !b.mealTime) return -1
                if (!a.mealTime && b.mealTime) return 1
                return a.sortOrder - b.sortOrder
            })
            .map((meal) => {
                const config = getMealTypeConfig(meal.type)
                const items = getMealItems(meal.id)
                return {
                    id: meal.id,
                    type: meal.type,
                    name: config.name,
                    color: config.color,
                    items: items.length,
                }
            })
    }

    const handleEditItem = async (itemId: string, amount: number) => {
        if (!selectedMeal) return
        const meal = getMealData(selectedMeal)
        if (!meal) return

        const isRecipe = meal.recipes?.some((r) => r.recipeId === itemId)
        const isIngredient = meal.ingredients?.some((i) => i.ingredientId === itemId)

        if (isRecipe || isIngredient) {
            await planner.updateQuantity.mutate({
                date: selectedDate,
                mealType: meal.type,
                itemType: isRecipe ? 'recipe' : 'ingredient',
                itemId,
                quantity: amount,
            })
        }
    }

    const handleDeleteItem = async (itemId: string) => {
        if (!selectedMeal) return
        const meal = getMealData(selectedMeal)
        if (!meal) return

        const isRecipe = meal.recipes?.some((r) => r.recipeId === itemId)
        const isIngredient = meal.ingredients?.some((i) => i.ingredientId === itemId)

        if (isRecipe || isIngredient) {
            await planner.removeItem.mutate({
                date: selectedDate,
                mealType: meal.type,
                itemType: isRecipe ? 'recipe' : 'ingredient',
                itemId,
            })
        }
    }

    const handleCompleteMeal = async (mealType: PrismaMealType) => {
        await planner.toggleMealCompletion.mutate({
            date: selectedDate,
            mealType: mealType,
        })
    }

    const handleUpdateMealTime = async (mealType: PrismaMealType, time: Date) => {
        await planner.updateMealTime.mutate({
            date: selectedDate,
            mealType: mealType,
            mealTime: time,
        })
    }

    const handleSelectMeal = (mealId: string) => {
        setSelectedMeal(mealId)
        onMealSelect(mealId)

        setExpandedMeals(new Set([mealId]))

        setTimeout(() => {
            const element = document.getElementById(`meal-${mealId}`)
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                })
            }
        }, 100)
    }

    const handleToggleExpanded = (mealId: string) => {
        setExpandedMeals((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(mealId)) {
                newSet.delete(mealId)
            } else {
                newSet.add(mealId)
            }
            return newSet
        })
    }

    const handleMealCreated = (mealId: string) => {
        handleSelectMeal(mealId)
    }

    const dayNutrition = calculateDayNutrition(menu)

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <Text text="Day Nutrition" variant="title" />
                </CardHeader>
                <CardContent className="pb-6">
                    <PieChart data={dayNutrition} size={180} />
                </CardContent>
            </Card>
            <div className="space-y-4">
                {getUpdatedMeals().map((meal) => (
                    <MealSection
                        key={meal.id}
                        meal={meal}
                        items={getMealItems(meal.id)}
                        isSelected={selectedMeal === meal.id}
                        isExpanded={expandedMeals.has(meal.id)}
                        onSelect={() => handleSelectMeal(meal.id)}
                        onToggleExpanded={() => handleToggleExpanded(meal.id)}
                        onEditItem={handleEditItem}
                        onDeleteItem={handleDeleteItem}
                        onCompleteMeal={handleCompleteMeal}
                        onUpdateMealTime={handleUpdateMealTime}
                        mealCompletedTime={getMealCompletedTime(meal.id) ?? null}
                    />
                ))}
            </div>
            <MealCreator selectedDate={selectedDate} onMealCreated={handleMealCreated} />
        </div>
    )
}
