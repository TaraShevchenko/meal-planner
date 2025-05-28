import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

import { Button } from 'shared/ui/Button'
import { Calendar } from 'shared/ui/Calendar'
import { Popover, PopoverContent, PopoverTrigger } from 'shared/ui/Popover'
import { Text } from 'shared/ui/Text'

import { type PlannerHeaderProps } from '../../model/types'

export function PlannerHeader({ selectedDate, onDateChange }: PlannerHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <Text variant="title" text="Choose a date and plan your meals" />
            <Popover>
                <PopoverTrigger asChild>
                    <Button text={format(selectedDate, 'dd MMMM yyyy', { locale: ru })} variant="outline" />
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && onDateChange(date)}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
