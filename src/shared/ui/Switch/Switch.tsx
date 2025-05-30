'use client'

import { type HTMLInputTypeAttribute, type InputHTMLAttributes, useMemo, useState } from 'react'

import { type VariantProps } from 'class-variance-authority'

import { Text, type TextProps } from 'shared/ui/Text'
import { cn } from 'shared/utils/cn'

import { type InputHint } from '../Input/model/types'
import { handleGetTypeAndVariantName, switchIcon, switchVariants } from './config'

export type SwitchProps = {
    className?: string
    label?: string
    labelTextProps?: TextProps
    inputFieldProps?: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>
    hints?: InputHint[]
    isError?: boolean
} & VariantProps<typeof switchVariants>

export function Switch({
    type = 'checkbox',
    variant = 'bordered',
    className,
    label,
    inputFieldProps,
    labelTextProps,
    ...otherProps
}: SwitchProps) {
    const { checked, onChange, name } = inputFieldProps ?? {}

    const typeAndVariantName = useMemo(() => handleGetTypeAndVariantName(type, variant), [type, variant])
    const Icon = useMemo(() => (typeAndVariantName ? switchIcon[typeAndVariantName] : undefined), [typeAndVariantName])

    const [active, setActive] = useState<VariantProps<typeof switchVariants>['active']>(
        checked ? typeAndVariantName : undefined,
    )

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setActive(e.target.checked ? typeAndVariantName : undefined)
        !!onChange && onChange(e)
    }

    return (
        <label className={cn('relative flex items-center gap-3', className)} htmlFor={name}>
            <span className={cn(switchVariants({ type, variant, active }))}>
                {Icon && <Icon className={cn('transition', active ? 'opacity-100' : 'opacity-0')} />}
            </span>
            {!!label && <Text text={label} {...labelTextProps} />}
            <input
                {...otherProps}
                type={type as HTMLInputTypeAttribute}
                id={name}
                onChange={handleChange}
                checked={checked}
                className={cn('absolute opacity-0', className)}
            />
        </label>
    )
}
Switch.displayName = 'Switch'
