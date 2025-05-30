'use client'

import { useFormContext } from 'react-hook-form'

import { Input as ClearInput, type InputProps } from 'shared/ui/Input'

export function Input(props: InputProps) {
    const name = props.inputFieldProps?.name ?? ''
    const {
        register,
        formState: { errors },
    } = useFormContext()

    const errorMessage =
        !!errors[name]?.message && typeof errors[name]?.message === 'string' ? errors[name]?.message : ''
    //TODO: delete console.log after adding error props to input
    !!errorMessage && console.log('Input Error Message', errorMessage)

    return <ClearInput {...props} {...register(name)} />
}
