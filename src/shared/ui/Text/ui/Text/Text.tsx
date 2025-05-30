import { type VariantProps } from 'class-variance-authority'

import { cn } from 'shared/utils/cn'

import { textCva } from './config'

type TextType = {
    className?: string
    text: string
    tag?: 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3'
    inheritColor?: boolean
}

export type TextProps = TextType & VariantProps<typeof textCva>

export function Text({ className, text, variant, tag, inheritColor }: TextProps) {
    const Comp = tag ? tag : 'span'
    return <Comp className={cn(textCva({ variant, className }), { 'text-inherit': inheritColor })}>{text}</Comp>
}
