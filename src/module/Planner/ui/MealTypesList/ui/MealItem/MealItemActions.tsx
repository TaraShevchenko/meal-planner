import { Edit2, MoreVertical, Trash2, X } from 'lucide-react'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from 'shared/ui/Dropdown'

interface MealItemActionsProps {
    onEdit: () => void
    onDelete: () => void
}

export function MealItemActions({ onEdit, onDelete }: MealItemActionsProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger icon={MoreVertical} buttonProps={{ size: 'iconSm' }} />
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit} icon={Edit2} text="Edit" />
                <DropdownMenuItem onClick={onDelete} icon={Trash2} text="Delete" />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
