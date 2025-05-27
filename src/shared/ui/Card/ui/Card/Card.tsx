import { type HTMLAttributes } from 'react'
import { forwardRef } from 'react'

import { cn } from 'shared/utils/cn'

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)}
            {...props}
        />
    )
})

Card.displayName = 'Card'
