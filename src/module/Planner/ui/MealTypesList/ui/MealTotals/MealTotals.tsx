import { Text } from 'shared/ui/Text'

interface NutritionTotals {
    calories: number
    protein: number
    fat: number
    carbs: number
}

interface MealTotalsProps {
    totals: NutritionTotals
}

export function MealTotals({ totals }: MealTotalsProps) {
    return (
        <div className="flex justify-between rounded-lg bg-muted/50 p-3 text-sm">
            <Text variant="sm" text="Total:" />
            <div className="flex gap-4">
                <Text variant="sm" text={`${totals.calories} kcal`} />
                <Text variant="sm" text={`P: ${totals.protein}g`} />
                <Text variant="sm" text={`F: ${totals.fat}g`} />
                <Text variant="sm" text={`C: ${totals.carbs}g`} />
            </div>
        </div>
    )
}
