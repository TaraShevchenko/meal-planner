import { useState } from 'react'

import { Check, X } from 'lucide-react'

import { Badge } from 'shared/ui/Badge'
import { Button } from 'shared/ui/Button'
import { Input } from 'shared/ui/Input'
import { Text } from 'shared/ui/Text'
import { num } from 'shared/utils/num'

import { MealItemActions } from './MealItemActions'

export interface MealItemData {
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

interface MealItemProps {
    item: MealItemData
    onEdit: (id: string, amount: number) => void
    onDelete: (id: string) => void
}

export function MealItem({ item, onEdit, onDelete }: MealItemProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [editAmount, setEditAmount] = useState(item.amount.toString())

    const handleSaveEdit = () => {
        const amount = parseFloat(editAmount)
        if (!isNaN(amount) && amount > 0) {
            onEdit(item.id, amount)
        }
        setIsEditing(false)
    }

    const handleCancelEdit = () => {
        setEditAmount(item.amount.toString())
        setIsEditing(false)
    }

    const handleStartEdit = () => {
        setEditAmount(item.amount.toString())
        setIsEditing(true)
    }

    return (
        <div className="flex items-center justify-between rounded-lg border p-2">
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <Text text={item.name} />
                    {/* <Badge variant="secondary">
                        <Text text={item.type === 'recipe' ? 'Recipe' : 'Ingredient'} variant="sm" />
                    </Badge> */}
                </div>
                <Text
                    className="mt-1"
                    text={`${num(item.calories)} kcal • P: ${num(item.protein)}g • F: ${num(item.fat)}g • C: ${num(item.carbs)}g`}
                    variant="muted"
                />
            </div>
            <div className="flex items-center gap-2">
                {isEditing ? (
                    <>
                        <div className="flex items-center gap-2">
                            <Input
                                inputFieldProps={{
                                    type: 'number',
                                    value: editAmount,
                                    onChange: (e) => setEditAmount(e.target.value),
                                    className: 'h-8 w-24',
                                    placeholder: item.type === 'recipe' ? 'Serving' : 'Grams',
                                }}
                            />
                        </div>
                        <Button size="fit" variant="link" onClick={handleSaveEdit} icon={Check} />
                        <Button size="fit" variant="link" onClick={handleCancelEdit} icon={X} />
                    </>
                ) : (
                    <>
                        <Text text={`${num(item.amount)} ${item.unit}`} />
                        <MealItemActions onEdit={handleStartEdit} onDelete={() => onDelete(item.id)} />
                    </>
                )}
            </div>
        </div>
    )
}
