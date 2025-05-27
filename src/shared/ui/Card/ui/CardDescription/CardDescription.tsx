import { type HTMLAttributes } from 'react'
import { forwardRef } from 'react'

import { cn } from 'shared/utils/cn'

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => {
        return <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
    },
)

CardDescription.displayName = 'CardDescription'
