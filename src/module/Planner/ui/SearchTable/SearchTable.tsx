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

import { type SearchTableProps } from '../../model/types'

export function SearchTable({ selectedMeal }: SearchTableProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [activeTab, setActiveTab] = useState<'ingredients' | 'recipes'>('ingredients')

    const { data: ingredientsData, isLoading: isLoadingIngredients } = api.planner.getIngredients.useQuery()
    const { data: recipesData, isLoading: isLoadingRecipes } = api.planner.getRecipes.useQuery()

    const ingredients = ingredientsData?.data?.ingredients ?? []
    const recipes = recipesData?.data?.recipes ?? []

    const filteredIngredients = ingredients.filter((ingredient) =>
        ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const filteredRecipes = recipes.filter((recipe) => recipe.name.toLowerCase().includes(searchTerm.toLowerCase()))

    const isLoading = isLoadingIngredients || isLoadingRecipes

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
                        />
                        <Button
                            text={'Recipes'}
                            variant={activeTab === 'recipes' ? 'default' : 'outline'}
                            onClick={() => setActiveTab('recipes')}
                        />
                    </div>
                </div>
                <Input
                    inputFieldProps={{
                        placeholder: `Поиск ${activeTab === 'ingredients' ? 'ингредиентов' : 'рецептов'}...`,
                        value: searchTerm,
                        onChange: (e) => setSearchTerm(e.target.value),
                        disabled: isLoading,
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
                                <TableRow key={ingredient.name}>
                                    <TableCell text={ingredient.name} />
                                    <TableCell text={`${ingredient.carbs}g`} />
                                    <TableCell text={`${ingredient.fat}g`} />
                                    <TableCell text={`${ingredient.protein}g`} />
                                    <TableCell text={`${ingredient.calories}kcal`} />
                                    <TableCellWithChildren>
                                        <Button icon={Plus} variant="outline" size="sm" />
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
                                <TableRow key={recipe.name}>
                                    <TableCell text={recipe.name} />
                                    <TableCellWithChildren className="flex flex-wrap gap-2">
                                        {recipe.ingredients.map((recipeIngredient) => (
                                            <Badge variant="secondary" key={recipeIngredient.ingredientId}>
                                                {recipeIngredient.ingredient.name}
                                            </Badge>
                                        ))}
                                    </TableCellWithChildren>
                                    <TableCellWithChildren>
                                        <Button icon={Plus} variant="outline" size="sm" />
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
            </CardContent>
        </Card>
    )
}
