'use client'

import { useState } from 'react'

import { addDays, format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Calendar } from 'lucide-react'
import { type DateRange } from 'react-day-picker'

import { Button } from 'shared/ui/Button'
import { Calendar as CalendarComponent } from 'shared/ui/Calendar'
import { Popover, PopoverContent, PopoverTrigger } from 'shared/ui/Popover'
import { Table, TableBody, TableCell, TableCellWithChildren, TableHead, TableHeader, TableRow } from 'shared/ui/Table'
import { Text } from 'shared/ui/Text'
import { cn } from 'shared/utils/cn'
import { num } from 'shared/utils/num'

import { useOrderByDateRange } from '../../model/hooks'

interface OrderTableProps {
    className?: string
}

export function OrderTable({ className }: OrderTableProps) {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 7),
    })
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)

    // Используем настоящий API вместо мок-данных
    const { data, isLoading, error } = useOrderByDateRange({
        dateFrom: dateRange?.from?.toISOString() || '',
        dateTo: dateRange?.to?.toISOString() || '',
    })

    const ingredients = data?.data?.ingredients || []

    const handleDateRangeSelect = (range: DateRange | undefined) => {
        setDateRange(range)
        if (range?.from && range?.to) {
            setIsCalendarOpen(false)
        }
    }

    const getDateRangeText = () => {
        if (!dateRange?.from) return 'Выберите период'
        if (!dateRange?.to) return format(dateRange.from, 'dd MMM yyyy', { locale: ru })

        if (dateRange.from.toDateString() === dateRange.to.toDateString()) {
            return format(dateRange.from, 'dd MMM yyyy', { locale: ru })
        }

        return `${format(dateRange.from, 'dd MMM', { locale: ru })} - ${format(dateRange.to, 'dd MMM yyyy', { locale: ru })}`
    }

    const generateShopLink = (ingredientName: string, shop: 'silpo' | 'atb') => {
        const encodedName = encodeURIComponent(ingredientName)

        if (shop === 'silpo') {
            return `https://silpo.ua/search?find=${encodedName}`
        } else {
            return `https://www.atbmarket.com/sch?query=${encodedName}`
        }
    }

    const getTotalWeight = () => {
        return ingredients.reduce((total, ingredient) => total + ingredient.totalGrams, 0)
    }

    const getTotalCalories = () => {
        return ingredients.reduce((total, ingredient) => {
            const portionCalories = (ingredient.calories * ingredient.totalGrams) / 100
            return total + portionCalories
        }, 0)
    }

    return (
        <div className={cn('space-y-6', className)}>
            <div className="flex items-center justify-between gap-4">
                <Text variant="title" text="List of purchases" />
                <div className="flex items-center gap-2">
                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                icon={Calendar}
                                text={getDateRangeText()}
                                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                            />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <CalendarComponent
                                mode="range"
                                selected={dateRange}
                                onSelect={handleDateRangeSelect}
                                numberOfMonths={2}
                                disabled={(date) => date < new Date('1900-01-01')}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            {isLoading ? (
                <div className="py-8 text-center text-muted-foreground">Loading...</div>
            ) : error ? (
                <div className="py-8 text-center text-red-500">Error: {error.message}</div>
            ) : ingredients.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                    {dateRange?.from && dateRange?.to
                        ? 'No planned dishes for the selected period'
                        : 'Select a period to display the list of purchases'}
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead text="Ingredient" />
                            <TableHead text="Amount" />
                            <TableHead text="Proteins" />
                            <TableHead text="Fats" />
                            <TableHead text="Carbs" />
                            <TableHead text="Calories" />
                            <TableHead text="Shops" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ingredients.map((ingredient) => {
                            const portionCalories = (ingredient.calories * ingredient.totalGrams) / 100
                            const portionProtein = (ingredient.protein * ingredient.totalGrams) / 100
                            const portionFat = (ingredient.fat * ingredient.totalGrams) / 100
                            const portionCarbs = (ingredient.carbs * ingredient.totalGrams) / 100

                            return (
                                <TableRow key={ingredient.id}>
                                    <TableCell text={ingredient.name} />
                                    <TableCell text={`${num(ingredient.totalGrams)}g`} />
                                    <TableCell text={`${num(portionProtein)}g`} />
                                    <TableCell text={`${num(portionFat)}g`} />
                                    <TableCell text={`${num(portionCarbs)}g`} />
                                    <TableCell text={`${num(portionCalories)} kcal`} />
                                    <TableCellWithChildren className="flex justify-end">
                                        <div className="flex gap-2">
                                            <Button
                                                text="Silpo"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    window.open(
                                                        generateShopLink(ingredient.name, 'silpo'),
                                                        '_blank',
                                                        'noopener,noreferrer',
                                                    )
                                                }}
                                                className="border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                                            />
                                            <Button
                                                text="ATB"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    window.open(
                                                        generateShopLink(ingredient.name, 'atb'),
                                                        '_blank',
                                                        'noopener,noreferrer',
                                                    )
                                                }}
                                                className="border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                                            />
                                        </div>
                                    </TableCellWithChildren>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            )}
        </div>
    )
}
