import { type VariantProps, cva } from 'class-variance-authority'

import { type textCva } from 'shared/ui/Text'

export const buttonBase = [
    'inline-flex items-center justify-center rounded-md transition-colors gap-2 disabled:opacity-70 disabled:cursor-not-allowed',
]

export const buttonVariants = {
    variant: {
        'default': [
            'border-primary bg-primary text-primary-foreground',
            'hover-yes:hover:bg-primary/90 hover-no:active:bg-primary/90',
        ],
        'outline': [
            'border border-input bg-background',
            'hover-yes:hover:bg-accent hover-no:active:bg-accent',
            'hover-yes:hover:text-accent-foreground hover-no:text-accent-foreground',
        ],
        'outline-dashed': [
            'border border-input bg-background border-dashed',
            'hover-yes:hover:bg-accent hover-no:active:bg-accent',
            'hover-yes:hover:text-accent-foreground hover-no:text-accent-foreground',
        ],
        'ghost': ['text-primary', 'hover-yes:hover:bg-accent hover-no:active:bg-accent'],
        'link': ['text-muted-foreground', 'hover-yes:hover:text-primary/80 hover-no:active:text-primary/80'],
    },
    activeByVariant: {
        'default': '',
        'outline': '',
        'outline-dashed': '',
        'ghost': '',
        'link': 'pointer-events-none text-primary',
    },
    size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3',
        icon: 'size-10',
        iconSm: 'size-8',
        fit: 'size-fit',
    },
}

export const buttonCva = cva(buttonBase, {
    variants: buttonVariants,
    defaultVariants: {
        variant: 'default',
        size: 'default',
    },
})

export const buttonIconVariants = cva('h-4 w-auto', {
    variants: {
        color: {
            default: 'primary',
            foreground: 'primary-foreground',
        },
    },
    defaultVariants: {
        color: 'default',
    },
})

export const TEXT_PROPS_BY_BUTTON_SIZE: Record<
    NonNullable<VariantProps<typeof buttonCva>['size']>,
    VariantProps<typeof textCva>['variant']
> = {
    default: 'default',
    sm: 'sm',
    icon: 'default',
    iconSm: 'default',
    fit: 'default',
}

export const ICON_COLOR_BY_BUTTON_VARIANT: Record<
    NonNullable<VariantProps<typeof buttonCva>['variant']>,
    VariantProps<typeof buttonIconVariants>['color']
> = {
    'default': 'foreground',
    'outline': 'default',
    'outline-dashed': 'default',
    'ghost': 'default',
    'link': 'default',
}
