'use client'

import { useState } from 'react'

import { type MealItemData, MealSection } from './components'

interface MealType {
    id: string
    name: string
    color: string
    items: number
}

const mealTypes: MealType[] = [
    { id: 'breakfast', name: 'Breakfast', color: 'bg-orange-500', items: 3 },
    { id: 'lunch', name: 'Lunch', color: 'bg-blue-500', items: 0 },
    { id: 'dinner', name: 'Dinner', color: 'bg-blue-600', items: 0 },
    { id: 'snack', name: 'Snack', color: 'bg-purple-500', items: 0 },
]

const breakfastItems: MealItemData[] = [
    {
        id: '1',
        type: 'recipe',
        name: 'Vegetable Omelet',
        amount: 1,
        unit: 'portion',
        calories: 280,
        protein: 18,
        fat: 22,
        carbs: 4,
        completed: true,
    },
    {
        id: '2',
        type: 'ingredient',
        name: 'Whole Grain Bread',
        amount: 50,
        unit: 'g',
        calories: 120,
        protein: 4,
        fat: 2,
        carbs: 22,
        completed: false,
    },
    {
        id: '3',
        type: 'ingredient',
        name: 'Avocado',
        amount: 80,
        unit: 'g',
        calories: 128,
        protein: 2,
        fat: 12,
        carbs: 6,
        completed: false,
    },
]

export function MealTypesList() {
    const [selectedMeal, setSelectedMeal] = useState<string>('breakfast')

    const getMealItems = (mealId: string): MealItemData[] => {
        if (mealId === 'breakfast') return breakfastItems
        return []
    }

    const handleEditItem = (itemId: string, amount: number) => {
        console.log('Editing item:', itemId, 'new amount:', amount)
    }

    const handleDeleteItem = (itemId: string) => {
        console.log('Deleting item:', itemId)
    }

    const handleCompleteItem = (itemId: string) => {
        console.log('Completing item:', itemId)
    }

    const handleAddMeal = (mealType: string) => {
        console.log('Adding meal to:', mealType)
    }

    return (
        <div className="space-y-4">
            {mealTypes.map((mealType) => (
                <MealSection
                    key={mealType.id}
                    mealType={mealType}
                    items={getMealItems(mealType.id)}
                    isSelected={selectedMeal === mealType.id}
                    onSelect={() => setSelectedMeal(mealType.id)}
                    onEditItem={handleEditItem}
                    onDeleteItem={handleDeleteItem}
                    onCompleteItem={handleCompleteItem}
                    onAddMeal={() => handleAddMeal(mealType.id)}
                />
            ))}
        </div>
    )
}
