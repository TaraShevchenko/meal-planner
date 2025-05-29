import { Text } from 'shared/ui/Text'
import { num } from 'shared/utils/num'

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
                <Text variant="sm" text={`${num(totals.calories)} kcal`} />
                <Text variant="sm" text={`P: ${num(totals.protein)}g`} />
                <Text variant="sm" text={`F: ${num(totals.fat)}g`} />
                <Text variant="sm" text={`C: ${num(totals.carbs)}g`} />
            </div>
        </div>
    )
}
