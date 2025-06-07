import { useState } from 'react'

import { Clock } from 'lucide-react'

import { Badge } from 'shared/ui/Badge'
import { Button, ButtonWithChild } from 'shared/ui/Button'
import { Input } from 'shared/ui/Input'
import { Popover, PopoverContent, PopoverTrigger } from 'shared/ui/Popover'
import { Text } from 'shared/ui/Text'
import { cn } from 'shared/utils/cn'

import { type TimeSelectorProps } from '../../model/types'

export function TimeSelector({
    value,
    onChange,
    disabled = false,
    className,
    placeholder = 'Select time',
}: TimeSelectorProps) {
    const [open, setOpen] = useState(false)
    const [timeInput, setTimeInput] = useState('')

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        })
    }

    const parseTimeInput = (timeStr: string): Date | null => {
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/
        const match = timeStr.match(timeRegex)

        if (!match || !match[1] || !match[2]) return null

        const hours = parseInt(match[1], 10)
        const minutes = parseInt(match[2], 10)

        const now = new Date()
        const newTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes)

        return newTime
    }

    const handleTimeChange = (timeStr: string) => {
        setTimeInput(timeStr)

        const parsedTime = parseTimeInput(timeStr)
        if (parsedTime) {
            onChange(parsedTime)
            setOpen(false)
            setTimeInput('')
        }
    }

    const handleInputKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleTimeChange(timeInput)
        } else if (e.key === 'Escape') {
            setOpen(false)
            setTimeInput('')
        }
    }

    const currentTime = value ? formatTime(value) : null

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <ButtonWithChild
                    variant="ghost"
                    disabled={disabled}
                    className={cn('h-auto p-0 text-secondary-foreground hover:text-foreground', className)}
                    onClick={(e) => e.stopPropagation()}
                >
                    <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                        <Clock className="h-3 w-3" />
                        <Text className="text-secondary-foreground" text={currentTime || placeholder} />
                    </Badge>
                </ButtonWithChild>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3" align="end">
                <div className="space-y-2">
                    <Text text="Set completion time" variant="smBold" />
                    <Input
                        inputFieldProps={{
                            type: 'time',
                            value: timeInput || (currentTime ? currentTime : ''),
                            onChange: (e) => setTimeInput(e.target.value),
                            onKeyDown: handleInputKeyDown,
                            placeholder: 'HH:MM',
                            autoFocus: true,
                        }}
                    />
                    <div className="flex gap-2">
                        <Button
                            text="Save"
                            size="sm"
                            onClick={() => handleTimeChange(timeInput)}
                            disabled={!timeInput}
                        />
                        <Button
                            text="Cancel"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                                setOpen(false)
                                setTimeInput('')
                            }}
                        />
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

TimeSelector.displayName = 'TimeSelector'
