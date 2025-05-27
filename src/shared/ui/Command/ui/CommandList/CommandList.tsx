import { type ComponentPropsWithoutRef, type ElementRef } from 'react'
import { forwardRef } from 'react'

import { Command } from 'cmdk'

import { cn } from 'shared/utils/cn'

const { List } = Command

export const CommandList = forwardRef<ElementRef<typeof List>, ComponentPropsWithoutRef<typeof List>>(
    ({ className, ...otherProps }, ref) => {
        return (
            <List
                ref={ref}
                className={cn('max-h-[300px] overflow-y-auto overflow-x-hidden', className)}
                {...otherProps}
            />
        )
    },
)

CommandList.displayName = List.displayName
