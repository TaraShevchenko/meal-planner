import { type MealType as PrismaMealType } from '@prisma/client'
import { Check, X } from 'lucide-react'

import { Badge } from 'shared/ui/Badge'
import { Button } from 'shared/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from 'shared/ui/Card'
import { Text } from 'shared/ui/Text'

import { MealItem, type MealItemData } from '../MealItem/MealItem'
import { MealTotals } from '../MealTotals/MealTotals'

interface Meal {
    type: PrismaMealType
    name: string
    color: string
    items: number
}

interface MealSectionProps {
    meal: Meal
    items: MealItemData[]
    isSelected: boolean
    onSelect: () => void
    onEditItem: (type: string, amount: number) => void
    onDeleteItem: (type: string) => void
    onCompleteMeal: (type: PrismaMealType) => void
    mealCompletedTime: Date | null
}

export function MealSection({
    meal,
    items,
    isSelected,
    onSelect,
    onEditItem,
    onDeleteItem,
    onCompleteMeal,
    mealCompletedTime,
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
                        <div className={`h-3 w-3 rounded-full ${meal.color}`} />
                        <CardTitle className="text-lg">{meal.name}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        {mealCompletedTime ? (
                            <div className="flex items-center gap-2">
                                <Text text={'Completed at'} />
                                <Badge variant="secondary">
                                    <Text
                                        className="text-secondary-foreground"
                                        text={mealCompletedTime.toLocaleTimeString()}
                                    />
                                </Badge>
                                <Button
                                    className="max-h-[26px]"
                                    size="iconSm"
                                    variant="ghost"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onCompleteMeal(meal.type)
                                    }}
                                    disabled={items?.length < 1}
                                    icon={X}
                                />
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Button
                                    className="max-h-[26px]"
                                    size="iconSm"
                                    variant="ghost"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onCompleteMeal(meal.type)
                                    }}
                                    icon={Check}
                                    disabled={items?.length < 1}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {items.length > 0 ? (
                    <div className="space-y-4">
                        <MealTotals totals={totals} />
                        <div className="space-y-2">
                            {items.map((item) => (
                                <MealItem key={item.id} item={item} onEdit={onEditItem} onDelete={onDeleteItem} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="mb-4 text-center text-muted-foreground">No meals added yet</div>
                )}
            </CardContent>
        </Card>
    )
}
