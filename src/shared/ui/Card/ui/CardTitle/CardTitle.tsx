import { type HTMLAttributes } from 'react'

import { cn } from 'shared/utils/cn'
import { forwardRef } from 'react'

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => {
        return <h3 ref={ref} className={cn('text-2xl font-semibold leading-none tracking-tight', className)} {...props} />
    }
)

CardTitle.displayName = 'CardTitle'
