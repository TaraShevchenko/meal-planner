import { type ReactNode } from 'react'

import { cn } from 'shared/utils/cn'

type TContainerProps = {
    className?: string
    children: ReactNode
}

export const Container = ({ children, className }: TContainerProps) => {
    return <div className={cn('container mx-auto w-full px-2', className)}>{children}</div>
}
