import type { Meta, StoryObj } from '@storybook/react'

import { PieChart } from './PieChart'

const meta: Meta<typeof PieChart> = {
    title: 'UI/PieChart',
    component: PieChart,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: { type: 'number', min: 100, max: 400, step: 20 },
        },
    },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        data: {
            protein: 120,
            fat: 80,
            carbs: 250,
            calories: 2100,
        },
        size: 200,
    },
}

export const Small: Story = {
    args: {
        data: {
            protein: 60,
            fat: 40,
            carbs: 150,
            calories: 1200,
        },
        size: 150,
    },
}

export const Large: Story = {
    args: {
        data: {
            protein: 150,
            fat: 100,
            carbs: 300,
            calories: 2800,
        },
        size: 250,
    },
}

export const EmptyData: Story = {
    args: {
        data: {
            protein: 0,
            fat: 0,
            carbs: 0,
            calories: 0,
        },
        size: 200,
    },
}

export const LowCarb: Story = {
    args: {
        data: {
            protein: 150,
            fat: 120,
            carbs: 50,
            calories: 1800,
        },
        size: 200,
    },
}

export const HighCarb: Story = {
    args: {
        data: {
            protein: 80,
            fat: 30,
            carbs: 400,
            calories: 2200,
        },
        size: 200,
    },
}
