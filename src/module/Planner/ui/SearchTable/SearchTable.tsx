'use client'

import { useState } from 'react'

import { type MealType as PrismaMealType } from '@prisma/client'
import { Plus, Search } from 'lucide-react'

import { api } from 'shared/lib/trpc/client'
import { Badge } from 'shared/ui/Badge'
import { Button } from 'shared/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from 'shared/ui/Card'
import { Input } from 'shared/ui/Input'
import { Table, TableBody, TableCell, TableCellWithChildren, TableHead, TableHeader, TableRow } from 'shared/ui/Table'
import { Text } from 'shared/ui/Text'

import { usePlanner } from '../../model/hooks'

interface SearchTableProps {
    selectedMeal: string
    selectedDate: string
}

export function SearchTable({ selectedMeal, selectedDate }: SearchTableProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [activeTab, setActiveTab] = useState<'ingredients' | 'recipes'>('ingredients')

    const { data: ingredientsData, isLoading: isLoadingIngredients } = api.planner.getIngredients.useQuery()
    const { data: recipesData, isLoading: isLoadingRecipes } = api.planner.getRecipes.useQuery()
    const planner = usePlanner()

    const ingredients = ingredientsData?.data?.ingredients ?? []
    const recipes = recipesData?.data?.recipes ?? []

    const filteredIngredients = ingredients.filter((ingredient) =>
        ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const filteredRecipes = recipes.filter((recipe) => recipe.name.toLowerCase().includes(searchTerm.toLowerCase()))

    const isLoading = isLoadingIngredients || isLoadingRecipes

    const handleAddIngredient = async (ingredientId: string) => {
        try {
            await planner.addItem.mutate({
                date: selectedDate,
                mealType: selectedMeal as PrismaMealType,
                itemType: 'ingredient',
                itemId: ingredientId,
                quantity: 100, // По умолчанию 100г
            })
        } catch (error) {
            console.error('Error adding ingredient:', error)
        }
    }

    const handleAddRecipe = async (recipeId: string) => {
        try {
            await planner.addItem.mutate({
                date: selectedDate,
                mealType: selectedMeal as PrismaMealType,
                itemType: 'recipe',
                itemId: recipeId,
                quantity: 1, // По умолчанию 1 порция
            })
        } catch (error) {
            console.error('Error adding recipe:', error)
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <CardTitle>
                        <Text variant="title" text={`Add to ${selectedMeal}`} />
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
                        placeholder: `Поиск ${activeTab === 'ingredients' ? 'ингредиентов' : 'рецептов'}...`,
                        value: searchTerm,
                        onChange: (e) => setSearchTerm(e.target.value),
                        disabled: isLoading || planner.addItem.isLoading,
                    }}
                    leftIcon={Search}
                />
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="py-8 text-center text-muted-foreground">Загрузка...</div>
                ) : activeTab === 'ingredients' ? (
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
                                            disabled={planner.addItem.isLoading}
                                        />
                                    </TableCellWithChildren>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}

                {!isLoading &&
                    ((activeTab === 'ingredients' && filteredIngredients.length === 0) ||
                        (activeTab === 'recipes' && filteredRecipes.length === 0)) && (
                        <div className="py-8 text-center text-muted-foreground">Ничего не найдено</div>
                    )}

                {planner.addItem.error && (
                    <div className="mt-2 rounded border border-red-300 bg-red-100 p-2 text-red-700">
                        Ошибка при добавлении: {planner.addItem.error.message}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
