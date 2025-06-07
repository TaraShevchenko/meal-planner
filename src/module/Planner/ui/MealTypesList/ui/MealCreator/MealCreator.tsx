import { type MealType } from '@prisma/client'
import { Plus } from 'lucide-react'

import { Text } from 'shared/ui/Text'

import { getMealTypeConfig } from '../../../../model/config'
import { usePlanner } from '../../../../model/hooks'

interface MealCreatorProps {
    selectedDate: string
    onMealCreated: (mealId: string) => void
}

const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack']

export function MealCreator({ selectedDate, onMealCreated }: MealCreatorProps) {
    const planner = usePlanner()

    const handleCreateMeal = async (mealType: MealType) => {
        try {
            const result = await planner.createMeal.mutate({
                date: selectedDate,
                mealType,
            })

            if (result.data.mealId) {
                onMealCreated(result.data.mealId)
            }
        } catch (error) {
            console.error('Error creating meal:', error)
        }
    }

    return (
        <div className="grid grid-cols-2 gap-3">
            {mealTypes.map((mealType) => {
                const config = getMealTypeConfig(mealType)
                return (
                    <button
                        key={mealType}
                        className="flex h-auto flex-col items-center gap-2 rounded-md border border-input bg-background px-3 py-3 text-sm ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                        onClick={() => handleCreateMeal(mealType)}
                        disabled={planner.createMeal.isLoading}
                    >
                        <div className="flex items-center gap-2">
                            <div className={`h-3 w-3 rounded-full ${config.color}`} />
                            <Text text={config.name} />
                            <Plus className="h-4 w-4" />
                        </div>
                    </button>
                )
            })}
        </div>
    )
}
