import { useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react'

import { TimeSelector } from './TimeSelector'

const meta: Meta<typeof TimeSelector> = {
    title: 'Shared/TimeSelector',
    component: TimeSelector,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => {
        const [time, setTime] = useState<Date | null>(null)

        return (
            <div className="p-4">
                <TimeSelector value={time} onChange={setTime} placeholder="Select completion time" />
                {time && (
                    <p className="mt-2 text-sm text-muted-foreground">Selected time: {time.toLocaleTimeString()}</p>
                )}
            </div>
        )
    },
}

export const WithInitialValue: Story = {
    render: () => {
        const initialTime = new Date()
        initialTime.setHours(14, 30, 0, 0)

        const [time, setTime] = useState<Date | null>(initialTime)

        return (
            <div className="p-4">
                <TimeSelector value={time} onChange={setTime} placeholder="Select completion time" />
                {time && (
                    <p className="mt-2 text-sm text-muted-foreground">Selected time: {time.toLocaleTimeString()}</p>
                )}
            </div>
        )
    },
}

export const Disabled: Story = {
    render: () => {
        const [time, setTime] = useState<Date | null>(null)

        return (
            <div className="p-4">
                <TimeSelector value={time} onChange={setTime} disabled={true} placeholder="Disabled time selector" />
            </div>
        )
    },
}
