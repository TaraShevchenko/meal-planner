import { type ComponentPropsWithoutRef } from 'react'

import { Content, Portal, Viewport } from '@radix-ui/react-select'

import { cn } from 'shared/utils/cn'

import { SelectScrollDownButton } from '../SelectScrollDownButton'
import { SelectScrollUpButton } from '../SelectScrollUpButton'

type SelectContentProps = ComponentPropsWithoutRef<typeof Content>

export function SelectContent({ className, children, position = 'popper', ...props }: SelectContentProps) {
    return (
        <Portal>
            <Content
                className={cn(
                    'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md',
                    position === 'popper' &&
                        'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
                    className,
                )}
                position={position}
                {...props}
            >
                <SelectScrollUpButton />
                <Viewport
                    className={cn(
                        'p-1',
                        position === 'popper' &&
                            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
                    )}
                >
                    {children}
                </Viewport>
                <SelectScrollDownButton />
            </Content>
        </Portal>
    )
}
