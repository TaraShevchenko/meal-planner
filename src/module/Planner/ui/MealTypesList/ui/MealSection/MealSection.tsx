import { ChevronUp, Plus } from 'lucide-react'

import { Button } from 'shared/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from 'shared/ui/Card'
import { Text } from 'shared/ui/Text'

import { MealItem, type MealItemData } from '../MealItem/MealItem'
import { MealTotals } from '../MealTotals/MealTotals'

interface MealType {
    id: string
    name: string
    color: string
    items: number
}

interface MealSectionProps {
    mealType: MealType
    items: MealItemData[]
    isSelected: boolean
    onSelect: () => void
    onEditItem: (id: string, amount: number) => void
    onDeleteItem: (id: string) => void
    onCompleteItem: (id: string) => void
    onAddMeal: () => void
}

export function MealSection({
    mealType,
    items,
    isSelected,
    onSelect,
    onEditItem,
    onDeleteItem,
    onCompleteItem,
    onAddMeal,
}: MealSectionProps) {
    const calculateTotals = (items: MealItemData[]) => {
        return items.reduce(
            (totals, item) => ({
                calories: totals.calories + item.calories,
                protein: totals.protein + item.protein,
                fat: totals.fat + item.fat,
                carbs: totals.carbs + item.carbs,
            }),
            { calories: 0, protein: 0, fat: 0, carbs: 0 },
        )
    }

    const totals = calculateTotals(items)

    return (
        <Card
            className={`cursor-pointer transition-all ${isSelected ? 'border-primary/70 ring-1 ring-primary/70' : ''}`}
            onClick={onSelect}
        >
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full ${mealType.color}`} />
                        <CardTitle className="text-lg">{mealType.name}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        <Text variant="sm" text={`${items.length} items`} />
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {items.length > 0 ? (
                    <div className="space-y-4">
                        <MealTotals totals={totals} />
                        <div className="space-y-2">
                            {items.map((item) => (
                                <MealItem
                                    key={item.id}
                                    item={item}
                                    onEdit={onEditItem}
                                    onDelete={onDeleteItem}
                                    onComplete={onCompleteItem}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="mb-4 text-center text-muted-foreground">No meals added yet</div>
                )}

                <Button
                    variant="outline"
                    className="mt-4 w-full border-dashed"
                    size="sm"
                    icon={Plus}
                    text="Add Meal"
                    onClick={(e) => {
                        e.stopPropagation()
                        onAddMeal()
                    }}
                />
            </CardContent>
        </Card>
    )
}
