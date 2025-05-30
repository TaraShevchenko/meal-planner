import { type TdHTMLAttributes } from 'react'

import { cn } from 'shared/utils/cn'

export function TableCellWithChildren({ className, children, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
    return (
        <td className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)} {...props}>
            {children}
        </td>
    )
}
