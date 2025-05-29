import { Check, Edit2, MoreVertical, Trash2, X } from 'lucide-react'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from 'shared/ui/Dropdown'

import { type MealItemData } from './MealItem'

interface MealItemActionsProps {
    item: MealItemData
    onEdit: () => void
    onDelete: () => void
    onComplete: () => void
}

export function MealItemActions({ item, onEdit, onDelete, onComplete }: MealItemActionsProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger icon={MoreVertical} buttonProps={{ size: 'iconSm' }} />
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit} icon={Edit2} text="Edit" />
                <DropdownMenuItem
                    onClick={onComplete}
                    icon={item.completed ? X : Check}
                    text={item.completed ? 'Mark as incomplete' : 'Mark as complete'}
                />
                <DropdownMenuItem onClick={onDelete} icon={Trash2} text="Delete" />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
