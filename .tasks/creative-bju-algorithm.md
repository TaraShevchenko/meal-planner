# 🎨🎨🎨 ENTERING CREATIVE PHASE: BJU CALCULATION ALGORITHM 🎨🎨🎨

**Фокус:** Алгоритм расчета белков, жиров, углеводов (БЖУ) и калорий
**Цель:** Создать точную и эффективную систему расчета пищевой ценности
**Требования:** Поддержка различных единиц измерения, семейных норм, точность расчетов

## КОНТЕКСТ И ТРЕБОВАНИЯ

### Функциональные требования:
- Расчет БЖУ для отдельных ингредиентов
- Расчет БЖУ для рецептов (сумма ингредиентов)
- Расчет БЖУ для приемов пищи
- Расчет дневных и недельных сводок
- Поддержка различных единиц измерения (г, кг, мл, л, штуки, порции)
- Конвертация между единицами измерения
- Расчет индивидуальных норм для участников семьи
- Отслеживание прогресса к целевым показателям

### Технические ограничения:
- Высокая производительность (расчеты в реальном времени)
- Точность расчетов (до 1 грамма для БЖУ, до 1 ккал для калорий)
- Поддержка больших объемов данных (семьи с множественными планами)
- Кэширование результатов для оптимизации
- Валидация входных данных
- Обработка ошибок и граничных случаев

### Бизнес-требования:
- Соответствие стандартам пищевой ценности
- Поддержка российских и международных стандартов
- Гибкость для добавления новых метрик (витамины, минералы)
- Простота интеграции с UI компонентами
- Возможность экспорта данных

## АНАЛИЗ ПРЕДМЕТНОЙ ОБЛАСТИ

### Структура данных о пищевой ценности
```typescript
interface NutritionData {
  calories: number      // ккал на 100г
  protein: number       // г на 100г
  fat: number          // г на 100г
  carbohydrates: number // г на 100г
  fiber?: number       // г на 100г (опционально)
  sugar?: number       // г на 100г (опционально)
  sodium?: number      // мг на 100г (опционально)
}

interface Ingredient {
  id: string
  name: string
  nutrition: NutritionData
  defaultUnit: MeasurementUnit
  density?: number     // г/мл для жидкостей
}
```

### Единицы измерения и конвертация
```typescript
type MeasurementUnit = 
  | 'gram' | 'kilogram'
  | 'milliliter' | 'liter'
  | 'piece' | 'portion'
  | 'tablespoon' | 'teaspoon'
  | 'cup' | 'glass'

interface ConversionRule {
  from: MeasurementUnit
  to: MeasurementUnit
  factor: number
  ingredientSpecific?: boolean
}
```

### Целевые показатели для участников семьи
```typescript
interface NutritionGoals {
  calories: number
  protein: number
  fat: number
  carbohydrates: number
  calculationMethod: 'manual' | 'harris-benedict' | 'mifflin-st-jeor'
}

interface FamilyMember {
  id: string
  name: string
  age: number
  gender: 'male' | 'female'
  weight: number
  height: number
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active'
  goals: NutritionGoals
}
```

## ВАРИАНТЫ АЛГОРИТМИЧЕСКИХ РЕШЕНИЙ

### Вариант 1: Простой линейный расчет
**Описание:** Прямой расчет БЖУ на основе пропорций от базовых значений на 100г

**Алгоритм:**
```typescript
function calculateNutrition(ingredient: Ingredient, amount: number, unit: MeasurementUnit): NutritionData {
  // 1. Конвертация в граммы
  const gramsAmount = convertToGrams(amount, unit, ingredient)
  
  // 2. Пропорциональный расчет
  const factor = gramsAmount / 100
  
  return {
    calories: ingredient.nutrition.calories * factor,
    protein: ingredient.nutrition.protein * factor,
    fat: ingredient.nutrition.fat * factor,
    carbohydrates: ingredient.nutrition.carbohydrates * factor
  }
}

function convertToGrams(amount: number, unit: MeasurementUnit, ingredient: Ingredient): number {
  switch (unit) {
    case 'gram': return amount
    case 'kilogram': return amount * 1000
    case 'milliliter': return amount * (ingredient.density || 1)
    case 'liter': return amount * 1000 * (ingredient.density || 1)
    case 'piece': return amount * (ingredient.averageWeight || 100)
    case 'portion': return amount * (ingredient.portionWeight || 150)
    default: throw new Error(`Unsupported unit: ${unit}`)
  }
}
```

**Преимущества:**
- Простота реализации и понимания
- Высокая производительность
- Легкость отладки
- Минимальные требования к памяти

**Недостатки:**
- Ограниченная точность для сложных конвертаций
- Сложность добавления новых единиц измерения
- Отсутствие учета потерь при готовке
- Нет кэширования результатов

**Временная сложность:** O(1)
**Пространственная сложность:** O(1)
**Обработка граничных случаев:** Базовая
**Масштабируемость:** Высокая для простых случаев

### Вариант 2: Система с кэшированием и валидацией
**Описание:** Расширенный алгоритм с кэшированием результатов, валидацией данных и обработкой ошибок

**Алгоритм:**
```typescript
interface CalculationCache {
  [key: string]: NutritionData
}

class NutritionCalculator {
  private cache: CalculationCache = {}
  private conversionRules: ConversionRule[]
  
  calculateNutrition(ingredient: Ingredient, amount: number, unit: MeasurementUnit): NutritionData {
    // 1. Валидация входных данных
    this.validateInput(ingredient, amount, unit)
    
    // 2. Проверка кэша
    const cacheKey = this.generateCacheKey(ingredient.id, amount, unit)
    if (this.cache[cacheKey]) {
      return this.cache[cacheKey]
    }
    
    // 3. Конвертация с использованием правил
    const gramsAmount = this.convertToGramsAdvanced(amount, unit, ingredient)
    
    // 4. Расчет с округлением
    const result = this.calculateWithRounding(ingredient.nutrition, gramsAmount)
    
    // 5. Кэширование результата
    this.cache[cacheKey] = result
    
    return result
  }
  
  private validateInput(ingredient: Ingredient, amount: number, unit: MeasurementUnit): void {
    if (amount <= 0) throw new Error('Amount must be positive')
    if (!ingredient.nutrition) throw new Error('Ingredient nutrition data is required')
    if (!this.isSupportedUnit(unit)) throw new Error(`Unsupported unit: ${unit}`)
  }
  
  private convertToGramsAdvanced(amount: number, unit: MeasurementUnit, ingredient: Ingredient): number {
    const rule = this.findConversionRule(unit, 'gram', ingredient)
    if (!rule) throw new Error(`No conversion rule found for ${unit} to gram`)
    
    return amount * rule.factor
  }
  
  private calculateWithRounding(nutrition: NutritionData, gramsAmount: number): NutritionData {
    const factor = gramsAmount / 100
    
    return {
      calories: Math.round(nutrition.calories * factor),
      protein: Math.round(nutrition.protein * factor * 10) / 10, // 1 decimal place
      fat: Math.round(nutrition.fat * factor * 10) / 10,
      carbohydrates: Math.round(nutrition.carbohydrates * factor * 10) / 10
    }
  }
  
  // Расчет для рецептов
  calculateRecipeNutrition(recipe: Recipe): NutritionData {
    return recipe.ingredients.reduce((total, recipeIngredient) => {
      const ingredientNutrition = this.calculateNutrition(
        recipeIngredient.ingredient,
        recipeIngredient.amount,
        recipeIngredient.unit
      )
      
      return {
        calories: total.calories + ingredientNutrition.calories,
        protein: total.protein + ingredientNutrition.protein,
        fat: total.fat + ingredientNutrition.fat,
        carbohydrates: total.carbohydrates + ingredientNutrition.carbohydrates
      }
    }, { calories: 0, protein: 0, fat: 0, carbohydrates: 0 })
  }
}
```

**Преимущества:**
- Высокая точность расчетов
- Кэширование для производительности
- Надежная валидация данных
- Гибкая система конвертации
- Хорошая обработка ошибок

**Недостатки:**
- Более сложная реализация
- Больше требований к памяти (кэш)
- Сложность настройки правил конвертации
- Потенциальные проблемы с инвалидацией кэша

**Временная сложность:** O(1) с кэшем, O(n) для рецептов
**Пространственная сложность:** O(k) где k - размер кэша
**Обработка граничных случаев:** Отличная
**Масштабируемость:** Высокая

### Вариант 3: Продвинутая система с учетом потерь при готовке
**Описание:** Комплексный алгоритм, учитывающий потери питательных веществ при различных способах приготовления

**Алгоритм:**
```typescript
interface CookingMethod {
  id: string
  name: string
  nutritionLossFactors: {
    protein: number    // 0.0 - 1.0 (доля потерь)
    fat: number
    carbohydrates: number
    vitamins?: number
  }
  weightLossFactor: number // потеря веса при готовке
}

interface CookingStep {
  method: CookingMethod
  duration: number // минуты
  temperature?: number // градусы
}

class AdvancedNutritionCalculator extends NutritionCalculator {
  private cookingMethods: CookingMethod[]
  
  calculateCookedNutrition(
    ingredient: Ingredient, 
    amount: number, 
    unit: MeasurementUnit,
    cookingSteps: CookingStep[]
  ): NutritionData {
    // 1. Базовый расчет сырого продукта
    let nutrition = this.calculateNutrition(ingredient, amount, unit)
    let currentWeight = this.convertToGrams(amount, unit, ingredient)
    
    // 2. Применение потерь от готовки
    for (const step of cookingSteps) {
      nutrition = this.applyCookingLosses(nutrition, step)
      currentWeight *= (1 - step.method.weightLossFactor)
    }
    
    // 3. Пересчет на фактический вес готового продукта
    const weightFactor = currentWeight / this.convertToGrams(amount, unit, ingredient)
    
    return {
      calories: nutrition.calories * weightFactor,
      protein: nutrition.protein * weightFactor,
      fat: nutrition.fat * weightFactor,
      carbohydrates: nutrition.carbohydrates * weightFactor
    }
  }
  
  private applyCookingLosses(nutrition: NutritionData, step: CookingStep): NutritionData {
    const losses = step.method.nutritionLossFactors
    
    return {
      calories: nutrition.calories * (1 - this.calculateCalorieLoss(losses)),
      protein: nutrition.protein * (1 - losses.protein),
      fat: nutrition.fat * (1 - losses.fat),
      carbohydrates: nutrition.carbohydrates * (1 - losses.carbohydrates)
    }
  }
  
  private calculateCalorieLoss(losses: any): number {
    // Калории теряются пропорционально потере макронутриентов
    return (losses.protein * 0.3 + losses.fat * 0.4 + losses.carbohydrates * 0.3)
  }
  
  // Расчет дневных норм по формуле Миффлина-Сан Жеора
  calculateDailyGoals(member: FamilyMember): NutritionGoals {
    let bmr: number
    
    if (member.gender === 'male') {
      bmr = 10 * member.weight + 6.25 * member.height - 5 * member.age + 5
    } else {
      bmr = 10 * member.weight + 6.25 * member.height - 5 * member.age - 161
    }
    
    const activityMultipliers = {
      'sedentary': 1.2,
      'light': 1.375,
      'moderate': 1.55,
      'active': 1.725,
      'very-active': 1.9
    }
    
    const totalCalories = bmr * activityMultipliers[member.activityLevel]
    
    return {
      calories: Math.round(totalCalories),
      protein: Math.round(totalCalories * 0.15 / 4), // 15% калорий из белка
      fat: Math.round(totalCalories * 0.25 / 9),      // 25% калорий из жиров
      carbohydrates: Math.round(totalCalories * 0.60 / 4), // 60% калорий из углеводов
      calculationMethod: 'mifflin-st-jeor'
    }
  }
  
  // Агрегация данных для семьи
  calculateFamilyProgress(family: Family, date: Date): FamilyNutritionSummary {
    const members = family.members.map(member => {
      const consumed = this.getMemberDailyConsumption(member.id, date)
      const goals = member.goals
      
      return {
        member,
        consumed,
        goals,
        progress: {
          calories: consumed.calories / goals.calories,
          protein: consumed.protein / goals.protein,
          fat: consumed.fat / goals.fat,
          carbohydrates: consumed.carbohydrates / goals.carbohydrates
        }
      }
    })
    
    return { members, date, familyId: family.id }
  }
}
```

**Преимущества:**
- Максимальная точность расчетов
- Учет реальных потерь при готовке
- Автоматический расчет индивидуальных норм
- Комплексная аналитика для семей
- Научно обоснованные формулы

**Недостатки:**
- Высокая сложность реализации
- Большие требования к данным (способы готовки)
- Сложность настройки и калибровки
- Потенциальная избыточность для простых случаев
- Высокие требования к производительности

**Временная сложность:** O(n*m) где n - ингредиенты, m - этапы готовки
**Пространственная сложность:** O(k + c) где k - кэш, c - способы готовки
**Обработка граничных случаев:** Превосходная
**Масштабируемость:** Средняя (требует оптимизации)

## 🎨 CREATIVE CHECKPOINT: Анализ алгоритмических подходов завершен

**Прогресс:** Определены 3 уровня сложности алгоритма расчета БЖУ
**Решения:** Проанализированы компромиссы между точностью и производительностью
**Следующие шаги:** Выбор оптимального решения и детализация реализации

## РЕШЕНИЕ

**Выбранный вариант:** Вариант 2 - Система с кэшированием и валидацией

**Обоснование:**
1. **Баланс сложности и функциональности:** Достаточно мощный для всех основных сценариев
2. **Производительность:** Кэширование обеспечивает быстрые повторные расчеты
3. **Надежность:** Валидация данных предотвращает ошибки
4. **Масштабируемость:** Легко расширяется для новых требований
5. **Простота интеграции:** Понятный API для UI компонентов
6. **Техническая реализуемость:** Не требует сложных данных о готовке

**Дополнения из Варианта 3:**
- Формулы расчета дневных норм (Миффлин-Сан Жеор)
- Агрегация данных для семейной аналитики
- Возможность будущего добавления учета готовки

## ДЕТАЛЬНАЯ АРХИТЕКТУРА РЕШЕНИЯ

### Основные классы и интерфейсы

```typescript
// Основной калькулятор
export class NutritionCalculator {
  private cache: Map<string, NutritionData>
  private conversionService: UnitConversionService
  private validator: NutritionValidator
  
  // Основные методы
  calculateIngredientNutrition(ingredient: Ingredient, amount: number, unit: MeasurementUnit): NutritionData
  calculateRecipeNutrition(recipe: Recipe): NutritionData
  calculateMealNutrition(meal: Meal): NutritionData
  calculateDailyNutrition(meals: Meal[]): NutritionData
  
  // Утилиты
  clearCache(): void
  getCacheStats(): CacheStats
}

// Сервис конвертации единиц
export class UnitConversionService {
  private rules: Map<string, ConversionRule[]>
  
  convertToGrams(amount: number, unit: MeasurementUnit, ingredient: Ingredient): number
  getSupportedUnits(ingredient: Ingredient): MeasurementUnit[]
  addConversionRule(rule: ConversionRule): void
}

// Валидатор данных
export class NutritionValidator {
  validateIngredient(ingredient: Ingredient): ValidationResult
  validateAmount(amount: number, unit: MeasurementUnit): ValidationResult
  validateNutritionData(data: NutritionData): ValidationResult
}

// Калькулятор целевых показателей
export class GoalsCalculator {
  calculateDailyGoals(member: FamilyMember, method: CalculationMethod): NutritionGoals
  calculateWeeklyGoals(member: FamilyMember): NutritionGoals
  adjustGoalsForActivity(goals: NutritionGoals, activityLevel: ActivityLevel): NutritionGoals
}

// Аналитический сервис
export class NutritionAnalytics {
  calculateProgress(consumed: NutritionData, goals: NutritionGoals): ProgressData
  generateDailyReport(member: FamilyMember, date: Date): DailyReport
  generateWeeklyReport(member: FamilyMember, startDate: Date): WeeklyReport
  generateFamilyReport(family: Family, date: Date): FamilyReport
}
```

### Система конвертации единиц

```typescript
interface ConversionRule {
  fromUnit: MeasurementUnit
  toUnit: MeasurementUnit
  factor?: number
  formula?: (amount: number, ingredient: Ingredient) => number
  ingredientTypes?: string[] // для каких типов ингредиентов применимо
}

// Предустановленные правила конвертации
const CONVERSION_RULES: ConversionRule[] = [
  // Базовые весовые единицы
  { fromUnit: 'kilogram', toUnit: 'gram', factor: 1000 },
  { fromUnit: 'gram', toUnit: 'kilogram', factor: 0.001 },
  
  // Объемные единицы для жидкостей
  { fromUnit: 'liter', toUnit: 'milliliter', factor: 1000 },
  { fromUnit: 'milliliter', toUnit: 'gram', formula: (amount, ingredient) => amount * (ingredient.density || 1) },
  
  // Кулинарные единицы
  { fromUnit: 'tablespoon', toUnit: 'milliliter', factor: 15 },
  { fromUnit: 'teaspoon', toUnit: 'milliliter', factor: 5 },
  { fromUnit: 'cup', toUnit: 'milliliter', factor: 240 },
  { fromUnit: 'glass', toUnit: 'milliliter', factor: 200 },
  
  // Штучные единицы (зависят от ингредиента)
  { 
    fromUnit: 'piece', 
    toUnit: 'gram', 
    formula: (amount, ingredient) => amount * (ingredient.averageWeight || 100),
    ingredientTypes: ['fruits', 'vegetables', 'eggs']
  },
  { 
    fromUnit: 'portion', 
    toUnit: 'gram', 
    formula: (amount, ingredient) => amount * (ingredient.portionWeight || 150)
  }
]
```

### Система кэширования

```typescript
interface CacheEntry {
  result: NutritionData
  timestamp: number
  accessCount: number
}

class NutritionCache {
  private cache = new Map<string, CacheEntry>()
  private maxSize = 1000
  private ttl = 3600000 // 1 час
  
  get(key: string): NutritionData | null {
    const entry = this.cache.get(key)
    if (!entry) return null
    
    // Проверка TTL
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key)
      return null
    }
    
    entry.accessCount++
    return entry.result
  }
  
  set(key: string, result: NutritionData): void {
    // Очистка кэша при превышении размера
    if (this.cache.size >= this.maxSize) {
      this.evictLeastUsed()
    }
    
    this.cache.set(key, {
      result,
      timestamp: Date.now(),
      accessCount: 1
    })
  }
  
  private evictLeastUsed(): void {
    let leastUsedKey = ''
    let minAccessCount = Infinity
    
    for (const [key, entry] of this.cache) {
      if (entry.accessCount < minAccessCount) {
        minAccessCount = entry.accessCount
        leastUsedKey = key
      }
    }
    
    if (leastUsedKey) {
      this.cache.delete(leastUsedKey)
    }
  }
  
  generateKey(ingredientId: string, amount: number, unit: MeasurementUnit): string {
    return `${ingredientId}:${amount}:${unit}`
  }
}
```

### Формулы расчета дневных норм

```typescript
class GoalsCalculator {
  // Формула Миффлина-Сан Жеора (наиболее точная)
  calculateBMR(member: FamilyMember): number {
    const { weight, height, age, gender } = member
    
    if (gender === 'male') {
      return 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161
    }
  }
  
  // Коэффициенты активности
  private getActivityMultiplier(level: ActivityLevel): number {
    const multipliers = {
      'sedentary': 1.2,      // Малоподвижный образ жизни
      'light': 1.375,        // Легкая активность (1-3 дня в неделю)
      'moderate': 1.55,      // Умеренная активность (3-5 дней в неделю)
      'active': 1.725,       // Высокая активность (6-7 дней в неделю)
      'very-active': 1.9     // Очень высокая активность (2 раза в день)
    }
    return multipliers[level]
  }
  
  // Расчет макронутриентов
  calculateMacroDistribution(totalCalories: number, profile: MacroProfile = 'balanced'): MacroDistribution {
    const profiles = {
      'balanced': { protein: 0.15, fat: 0.25, carbs: 0.60 },
      'high-protein': { protein: 0.25, fat: 0.25, carbs: 0.50 },
      'low-carb': { protein: 0.25, fat: 0.45, carbs: 0.30 },
      'mediterranean': { protein: 0.15, fat: 0.35, carbs: 0.50 }
    }
    
    const distribution = profiles[profile]
    
    return {
      protein: Math.round(totalCalories * distribution.protein / 4), // 4 ккал/г
      fat: Math.round(totalCalories * distribution.fat / 9),          // 9 ккал/г
      carbohydrates: Math.round(totalCalories * distribution.carbs / 4) // 4 ккал/г
    }
  }
}
```

### API для интеграции с UI

```typescript
// Основной API класс
export class NutritionAPI {
  private calculator: NutritionCalculator
  private analytics: NutritionAnalytics
  private goals: GoalsCalculator
  
  // Методы для UI компонентов
  async calculateIngredientNutrition(ingredientId: string, amount: number, unit: string): Promise<NutritionData>
  async calculateRecipeNutrition(recipeId: string): Promise<NutritionData>
  async getMemberProgress(memberId: string, date: string): Promise<ProgressData>
  async getFamilyOverview(familyId: string, date: string): Promise<FamilyOverview>
  
  // Утилиты для форм
  getSupportedUnits(ingredientId: string): MeasurementUnit[]
  getPopularPortions(ingredientId: string): PopularPortion[]
  validateNutritionInput(data: any): ValidationResult
  
  // Аналитика
  generateNutritionChart(memberId: string, period: 'day' | 'week' | 'month'): ChartData
  exportNutritionData(memberId: string, format: 'csv' | 'json'): string
}

// Типы для UI
interface ProgressData {
  current: NutritionData
  target: NutritionData
  percentages: {
    calories: number
    protein: number
    fat: number
    carbohydrates: number
  }
  status: 'under' | 'optimal' | 'over'
}

interface PopularPortion {
  name: string
  amount: number
  unit: MeasurementUnit
  description: string
}
```

## ВАЛИДАЦИЯ ТРЕБОВАНИЙ

**Функциональные требования выполнены:**
- ✅ Расчет БЖУ для ингредиентов, рецептов, приемов пищи
- ✅ Поддержка различных единиц измерения
- ✅ Конвертация между единицами
- ✅ Расчет индивидуальных норм
- ✅ Отслеживание прогресса
- ✅ Дневные и недельные сводки

**Технические требования выполнены:**
- ✅ Высокая производительность (кэширование)
- ✅ Точность расчетов (округление до 0.1г)
- ✅ Поддержка больших объемов (эффективные структуры данных)
- ✅ Валидация входных данных
- ✅ Обработка ошибок

**Техническая осуществимость:** Высокая
**Оценка производительности:** Отличная с кэшированием

## ПЛАН РЕАЛИЗАЦИИ

### Этап 1: Базовая функциональность
1. Создание основных интерфейсов и типов
2. Реализация простого калькулятора БЖУ
3. Базовая система конвертации единиц
4. Простая валидация данных

### Этап 2: Оптимизация и кэширование
1. Реализация системы кэширования
2. Расширенная валидация
3. Обработка ошибок и граничных случаев
4. Тестирование производительности

### Этап 3: Расширенная функциональность
1. Калькулятор дневных норм
2. Аналитические функции
3. API для интеграции с UI
4. Экспорт данных

### Этап 4: Полировка и оптимизация
1. Оптимизация алгоритмов
2. Расширенное тестирование
3. Документация API
4. Подготовка к будущим расширениям

🎨🎨🎨 EXITING CREATIVE PHASE - РЕШЕНИЕ ПРИНЯТО 🎨🎨🎨

**Краткое описание:** Выбрана система с кэшированием и валидацией для оптимального баланса функциональности и производительности
**Ключевые решения:**
- Модульная архитектура с четким разделением ответственности
- Эффективная система кэширования для производительности
- Гибкая система конвертации единиц измерения
- Научно обоснованные формулы расчета дневных норм
- Простой API для интеграции с UI компонентами

**Следующие шаги:** Переход к проектированию системы фасовки продуктов