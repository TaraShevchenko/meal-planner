import { type ComponentPropsWithoutRef, type ElementRef } from 'react'
import { forwardRef } from 'react'

import { Command } from 'cmdk'

const { Empty } = Command

export const CommandEmpty = forwardRef<ElementRef<typeof Empty>, ComponentPropsWithoutRef<typeof Empty>>(
    (props, ref) => {
        return <Empty ref={ref} className="py-6 text-center text-sm" {...props} />
    },
)

CommandEmpty.displayName = Empty.displayName
