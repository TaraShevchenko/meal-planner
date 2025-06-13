"use client";

import { useState } from "react";
import { familyClientQueries } from "~/entities/family/client";
import { recipeClientQueries } from "~/entities/recipe/client";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Calendar } from "~/components/ui/calendar";
import { Badge } from "~/components/ui/badge";
import { Plus, Calendar as CalendarIcon, Clock, Users } from "lucide-react";

export default function MealPlanningPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);

  // Get user families
  const { data: families } = familyClientQueries.useGetUserFamilies();

  // Get recipes for the selected family
  const { data: recipes } = recipeClientQueries.useGetFamilyRecipes(
    selectedFamily || ""
  );

  // Get quick meals
  const { data: quickMeals } = recipeClientQueries.useGetQuickMeals(
    selectedFamily || ""
  );

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Планирование питания</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Создать план питания
        </Button>
      </div>

      {/* Family Selection */}
      {families && families.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Выберите семью
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {families.map((family) => (
                <Badge
                  key={family.id}
                  variant={selectedFamily === family.id ? "default" : "outline"}
                  className="cursor-pointer p-2"
                  onClick={() => setSelectedFamily(family.id)}
                >
                  {family.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2" />
              Календарь
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Selected Date Meal Plan */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>План питания на {formatDate(selectedDate)}</CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedFamily ? (
              <p className="text-muted-foreground">Выберите семью для просмотра плана питания</p>
            ) : (
              <div className="space-y-4">
                {/* Breakfast */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Завтрак</h3>
                  <div className="text-sm text-muted-foreground">
                    Блюдо не выбрано
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Plus className="w-4 h-4 mr-1" />
                    Добавить блюдо
                  </Button>
                </div>

                {/* Lunch */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Обед</h3>
                  <div className="text-sm text-muted-foreground">
                    Блюдо не выбрано
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Plus className="w-4 h-4 mr-1" />
                    Добавить блюдо
                  </Button>
                </div>

                {/* Dinner */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Ужин</h3>
                  <div className="text-sm text-muted-foreground">
                    Блюдо не выбрано
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Plus className="w-4 h-4 mr-1" />
                    Добавить блюдо
                  </Button>
                </div>

                {/* Snacks */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Перекусы</h3>
                  <div className="text-sm text-muted-foreground">
                    Перекусы не добавлены
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Plus className="w-4 h-4 mr-1" />
                    Добавить перекус
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Meals Section */}
      {selectedFamily && quickMeals && quickMeals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Быстрые блюда
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickMeals.map((recipe) => (
                <Card key={recipe.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <h4 className="font-semibold">{recipe.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {recipe.cookingTime} мин • {recipe.servings} порций
                    </p>
                    {recipe.isQuickMeal && (
                      <Badge variant="secondary" className="text-xs mt-2">
                        Быстрое блюдо
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Recipes Section */}
      {selectedFamily && recipes && recipes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Все рецепты семьи</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recipes.map((recipe) => (
                <Card key={recipe.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <h4 className="font-semibold">{recipe.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {recipe.cookingTime} мин • {recipe.servings} порций
                    </p>
                    {recipe.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {recipe.description}
                      </p>
                    )}
                    {recipe.isQuickMeal && (
                      <Badge variant="secondary" className="text-xs mt-2">
                        Быстрое блюдо
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}