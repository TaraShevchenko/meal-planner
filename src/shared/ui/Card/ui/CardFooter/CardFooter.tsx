import { type HTMLAttributes } from 'react'
import { forwardRef } from 'react'

import { cn } from 'shared/utils/cn'

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
    return <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
})

CardFooter.displayName = 'CardFooter'
