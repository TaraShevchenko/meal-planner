import { type ComponentPropsWithoutRef, type ElementRef } from 'react'
import { forwardRef } from 'react'

import { Command } from 'cmdk'

import { cn } from 'shared/utils/cn'

const { Separator } = Command

export const CommandSeparator = forwardRef<ElementRef<typeof Separator>, ComponentPropsWithoutRef<typeof Separator>>(
    ({ className, ...otherProps }, ref) => {
        return <Separator ref={ref} className={cn('-mx-1 h-px bg-border', className)} {...otherProps} />
    },
)

CommandSeparator.displayName = Separator.displayName
