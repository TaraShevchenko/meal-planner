import { redirect } from "next/navigation";
import { auth, signOut } from "~/shared/api/auth";
import { Button } from "~/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/shared/ui/card";

export default async function HomePage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Планировщик питания
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Привет, {session.user?.name || session.user?.email}
              </span>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <Button type="submit" variant="outline" size="sm">
                  Выйти
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Планировщик питания */}
          <Card>
            <CardHeader>
              <CardTitle>Планировщик питания</CardTitle>
              <CardDescription>
                Планируйте приемы пищи на день и неделю
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" disabled>
                Открыть планировщик
                <span className="ml-2 text-xs">(в разработке)</span>
              </Button>
            </CardContent>
          </Card>

          {/* Рецепты */}
          <Card>
            <CardHeader>
              <CardTitle>Рецепты</CardTitle>
              <CardDescription>
                Управляйте своими рецептами и быстрыми блюдами
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" disabled>
                Мои рецепты
                <span className="ml-2 text-xs">(в разработке)</span>
              </Button>
            </CardContent>
          </Card>

          {/* Семейный режим */}
          <Card>
            <CardHeader>
              <CardTitle>Семейный режим</CardTitle>
              <CardDescription>
                Планируйте питание для всей семьи
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" disabled>
                Настроить семью
                <span className="ml-2 text-xs">(в разработке)</span>
              </Button>
            </CardContent>
          </Card>

          {/* Список покупок */}
          <Card>
            <CardHeader>
              <CardTitle>Список покупок</CardTitle>
              <CardDescription>
                Автоматические списки на основе планов питания
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" disabled>
                Создать список
                <span className="ml-2 text-xs">(в разработке)</span>
              </Button>
            </CardContent>
          </Card>

          {/* Пищевая ценность */}
          <Card>
            <CardHeader>
              <CardTitle>Пищевая ценность</CardTitle>
              <CardDescription>Отслеживайте БЖУ и калории</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" disabled>
                Посмотреть статистику
                <span className="ml-2 text-xs">(в разработке)</span>
              </Button>
            </CardContent>
          </Card>

          {/* Настройки */}
          <Card>
            <CardHeader>
              <CardTitle>Настройки</CardTitle>
              <CardDescription>
                Персональные настройки и предпочтения
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" disabled>
                Открыть настройки
                <span className="ml-2 text-xs">(в разработке)</span>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Информация о статусе */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Статус разработки</CardTitle>
              <CardDescription>
                Текущий прогресс реализации функций
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>✅ Авторизация через Google</span>
                  <span className="text-sm text-green-600">Завершено</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>✅ Защита роутов</span>
                  <span className="text-sm text-green-600">Завершено</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>✅ Настройка Supabase</span>
                  <span className="text-sm text-green-600">Настроено</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>🚧 Планировщик питания</span>
                  <span className="text-sm text-yellow-600">В разработке</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>🚧 Система рецептов</span>
                  <span className="text-sm text-yellow-600">В разработке</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
