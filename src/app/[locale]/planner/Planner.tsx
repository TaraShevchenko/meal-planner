'use client'

import { useState } from 'react'

import { MealTypesList, PlannerHeader, SearchTable } from 'module/Planner'

import { Container } from 'shared/ui/Container'

export function Planner() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [selectedMeal, setSelectedMeal] = useState<string>('breakfast')

    const formatDateForAPI = (date: Date): string => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    const handleMealSelect = (mealType: string) => {
        setSelectedMeal(mealType)
    }

    return (
        <Container className="space-y-6 py-10">
            <PlannerHeader selectedDate={selectedDate} onDateChange={setSelectedDate} />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <MealTypesList selectedDate={formatDateForAPI(selectedDate)} onMealSelect={handleMealSelect} />

                <div className="lg:col-span-2">
                    <SearchTable selectedMeal={selectedMeal} selectedDate={formatDateForAPI(selectedDate)} />
                </div>
            </div>
        </Container>
    )
}
