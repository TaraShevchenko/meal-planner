'use client'

import { useState } from 'react'

import { Plus, Search } from 'lucide-react'

import { api } from 'shared/lib/trpc/client'
import { Badge } from 'shared/ui/Badge'
import { Button } from 'shared/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from 'shared/ui/Card'
import { Input } from 'shared/ui/Input'
import { Table, TableBody, TableCell, TableCellWithChildren, TableHead, TableHeader, TableRow } from 'shared/ui/Table'
import { Text } from 'shared/ui/Text'

import { useMenuByDate, usePlanner } from '../../model/hooks'

interface SearchTableProps {
    selectedMeal: string | null
    selectedDate: string
}

export function SearchTable({ selectedMeal, selectedDate }: SearchTableProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [activeTab, setActiveTab] = useState<'ingredients' | 'recipes'>('recipes')

    const { data: ingredientsData, isLoading: isLoadingIngredients } = api.planner.getIngredients.useQuery()
    const { data: recipesData, isLoading: isLoadingRecipes } = api.planner.getRecipes.useQuery()
    const { menu } = useMenuByDate(selectedDate)
    const planner = usePlanner()

    const selectedMealData = menu?.meals?.find((meal) => meal.id === selectedMeal)
    const mealType = selectedMealData?.type

    const ingredients = ingredientsData?.data?.ingredients ?? []
    const recipes = recipesData?.data?.recipes ?? []

    const filteredIngredients = ingredients.filter((ingredient) =>
        ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const filteredRecipes = recipes.filter((recipe) => recipe.name.toLowerCase().includes(searchTerm.toLowerCase()))

    const isLoading = isLoadingIngredients || isLoadingRecipes

    const handleAddIngredient = async (ingredientId: string) => {
        if (!mealType) return
        try {
            await planner.addItem.mutate({
                date: selectedDate,
                mealType: mealType,
                itemType: 'ingredient',
                itemId: ingredientId,
                quantity: 100,
            })
        } catch (error) {
            console.error('Error adding ingredient:', error)
        }
    }

    const handleAddRecipe = async (recipeId: string) => {
        if (!mealType) return
        try {
            await planner.addItem.mutate({
                date: selectedDate,
                mealType: mealType,
                itemType: 'recipe',
                itemId: recipeId,
                quantity: 1,
            })
        } catch (error) {
            console.error('Error adding recipe:', error)
        }
    }

    return (
        <div className="h-[calc(100vh-56px)] lg:sticky lg:right-0 lg:top-4">
            <Card className="flex h-full flex-col">
                <CardHeader className="flex flex-shrink-0 flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <CardTitle>
                            <Text
                                variant="title"
                                text={mealType ? `Add to ${mealType}` : 'Select the meal before adding'}
                            />
                        </CardTitle>
                        <div className="flex gap-2">
                            <Button
                                text={'Ingredients'}
                                variant={activeTab === 'ingredients' ? 'default' : 'outline'}
                                onClick={() => setActiveTab('ingredients')}
                                disabled={planner.addItem.isLoading}
                            />
                            <Button
                                text={'Recipes'}
                                variant={activeTab === 'recipes' ? 'default' : 'outline'}
                                onClick={() => setActiveTab('recipes')}
                                disabled={planner.addItem.isLoading}
                            />
                        </div>
                    </div>
                    <Input
                        inputFieldProps={{
                            placeholder: `Search ${activeTab === 'ingredients' ? 'ingredients' : 'recipes'}...`,
                            value: searchTerm,
                            onChange: (e) => setSearchTerm(e.target.value),
                            disabled: isLoading || planner.addItem.isLoading,
                        }}
                        leftIcon={Search}
                    />
                </CardHeader>
                <CardContent className="flex flex-1 flex-col overflow-hidden">
                    {isLoading ? (
                        <div className="flex flex-1 items-center justify-center text-muted-foreground">Loading...</div>
                    ) : (
                        <div className="flex-1 overflow-auto">
                            {activeTab === 'ingredients' ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead text="Name" />
                                            <TableHead text="Carbs" />
                                            <TableHead text="Fat" />
                                            <TableHead text="Proteins" />
                                            <TableHead text="Calories" />
                                            <TableHead text="Action" />
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredIngredients.map((ingredient) => (
                                            <TableRow key={ingredient.id}>
                                                <TableCell text={ingredient.name} />
                                                <TableCell text={`${ingredient.carbs}g`} />
                                                <TableCell text={`${ingredient.fat}g`} />
                                                <TableCell text={`${ingredient.protein}g`} />
                                                <TableCell text={`${ingredient.calories}kcal`} />
                                                <TableCellWithChildren>
                                                    <Button
                                                        icon={Plus}
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleAddIngredient(ingredient.id)}
                                                        disabled={planner.addItem.isLoading}
                                                    />
                                                </TableCellWithChildren>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead text="Name" />
                                            <TableHead text="Ingredients" />
                                            <TableHead text="Action" />
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredRecipes.map((recipe) => (
                                            <TableRow key={recipe.id}>
                                                <TableCell text={recipe.name} />
                                                <TableCellWithChildren className="flex flex-wrap gap-2">
                                                    {recipe.ingredients.map((recipeIngredient) => (
                                                        <Badge variant="secondary" key={recipeIngredient.ingredientId}>
                                                            {recipeIngredient.ingredient.name}
                                                        </Badge>
                                                    ))}
                                                </TableCellWithChildren>
                                                <TableCellWithChildren>
                                                    <Button
                                                        icon={Plus}
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleAddRecipe(recipe.id)}
                                                        disabled={planner.addItem.isLoading || !mealType}
                                                    />
                                                </TableCellWithChildren>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    )}

                    {!isLoading &&
                        ((activeTab === 'ingredients' && filteredIngredients.length === 0) ||
                            (activeTab === 'recipes' && filteredRecipes.length === 0)) && (
                            <div className="flex flex-1 items-center justify-center text-muted-foreground">
                                Nothing found
                            </div>
                        )}

                    {planner.addItem.error && (
                        <div className="mt-2 rounded border border-red-300 bg-red-100 p-2 text-red-700">
                            Error adding: {planner.addItem.error.message}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
