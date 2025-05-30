import { type HTMLAttributes } from 'react'

import { cn } from 'shared/utils/cn'

type SkeletonProps = HTMLAttributes<HTMLDivElement>

export function Skeleton({ className, ...props }: SkeletonProps) {
    return <div className={cn('animate-pulse rounded-md bg-muted', className)} {...props} />
}
