import { type HTMLAttributes } from 'react'
import { forwardRef } from 'react'

import { cn } from 'shared/utils/cn'

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
    return <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
})

CardHeader.displayName = 'CardHeader'
