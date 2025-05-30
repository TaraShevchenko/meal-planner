import { type ComponentPropsWithoutRef, type ElementRef } from 'react'
import { forwardRef } from 'react'

import { Command } from 'cmdk'

import { cn } from 'shared/utils/cn'

const { Group } = Command

export const CommandGroup = forwardRef<ElementRef<typeof Group>, ComponentPropsWithoutRef<typeof Group>>(
    ({ className, ...otherProps }, ref) => {
        return (
            <Group
                ref={ref}
                className={cn(
                    'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground',
                    className,
                )}
                {...otherProps}
            />
        )
    },
)

CommandGroup.displayName = Group.displayName
