'use client'

import { useState } from 'react'

import { MealTypesList, PlannerHeader, SearchTable } from 'module/Planner'

import { Container } from 'shared/ui/Container'

export function Planner() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())

    return (
        <Container className="space-y-6 py-10">
            <PlannerHeader selectedDate={selectedDate} onDateChange={setSelectedDate} />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <MealTypesList />

                <div className="lg:col-span-2">
                    <SearchTable selectedMeal={'breakfast'} />
                </div>
            </div>
        </Container>
    )
}
