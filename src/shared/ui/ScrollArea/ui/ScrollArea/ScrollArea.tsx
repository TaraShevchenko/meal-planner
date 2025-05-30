import { type ComponentPropsWithoutRef } from 'react'

import { Corner, Root, Viewport } from '@radix-ui/react-scroll-area'

import { type Children } from 'shared/types'
import { cn } from 'shared/utils/cn'

import { ScrollBar, type ScrollbarClassNames, type ScrollbarProps } from '../ScrollBar'

export type ScrollAreaProps = {
    className?: string
    viewportClassName?: string
    cornerClassName?: string
    cornerProps?: Omit<ComponentPropsWithoutRef<typeof Corner>, 'className'>
    scrollAreaProps?: Omit<ComponentPropsWithoutRef<typeof Root>, 'className' | 'children'>
    scrollbarProps?: Omit<ScrollbarProps, 'variant'>
} & ScrollbarClassNames &
    Children

export function ScrollArea({
    className,
    scrollAreaProps,
    viewportClassName,
    children,
    scrollbarClassName,
    thumbClassName,
    scrollbarProps,
    cornerClassName,
    cornerProps,
}: ScrollAreaProps) {
    const { type = 'always', ...otherScrollAreaProps } = scrollAreaProps ?? {}

    return (
        <Root type={type} className={cn('relative h-full w-full overflow-hidden', className)} {...otherScrollAreaProps}>
            <Viewport className={cn('h-full w-full rounded-[inherit] pr-2.5', viewportClassName)}>{children}</Viewport>
            <ScrollBar scrollbarClassName={scrollbarClassName} thumbClassName={thumbClassName} {...scrollbarProps} />
            <Corner className={cornerClassName} {...cornerProps} />
        </Root>
    )
}
