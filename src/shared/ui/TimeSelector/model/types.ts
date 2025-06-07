export interface TimeSelectorProps {
    value?: Date | null
    onChange: (time: Date) => void
    disabled?: boolean
    className?: string
    placeholder?: string
}
