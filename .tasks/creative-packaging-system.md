# 🎨🎨🎨 ENTERING CREATIVE PHASE: PRODUCT PACKAGING SYSTEM 🎨🎨🎨

**Фокус:** Система фасовки продуктов для списков покупок
**Цель:** Создать интеллектуальную систему преобразования планов питания в оптимальные списки покупок
**Требования:** Учет реальных упаковок, минимизация отходов, оптимизация стоимости

## КОНТЕКСТ И ТРЕБОВАНИЯ

### Функциональные требования:
- Преобразование ингредиентов из планов питания в товары для покупки
- Учет реальных упаковок товаров в магазинах
- Группировка товаров по категориям и отделам магазина
- Оптимизация количества упаковок (минимизация отходов)
- Учет срока годности и возможности хранения
- Предложение альтернативных товаров и брендов
- Расчет примерной стоимости покупок
- Поддержка различных магазинов и их ассортимента

### Бизнес-требования:
- Снижение пищевых отходов в семьях
- Оптимизация бюджета на продукты
- Удобство планирования покупок
- Поддержка семейного планирования (большие объемы)
- Учет предпочтений и ограничений (аллергии, диеты)
- Интеграция с популярными сетями магазинов

### Технические ограничения:
- Высокая производительность для больших списков
- Точность расчетов упаковок
- Гибкость для добавления новых магазинов
- Кэширование данных о товарах
- Обработка изменений в ассортименте
- Поддержка offline-режима

## АНАЛИЗ ПРЕДМЕТНОЙ ОБЛАСТИ

### Структура данных о товарах
```typescript
interface Product {
  id: string
  name: string
  brand?: string
  category: ProductCategory
  packages: ProductPackage[]
  ingredient: Ingredient // связь с ингредиентом
  stores: StoreAvailability[]
  alternatives: string[] // ID альтернативных товаров
  tags: string[] // 'organic', 'gluten-free', etc.
}

interface ProductPackage {
  id: string
  size: number
  unit: MeasurementUnit
  price: number
  currency: string
  pricePerUnit: number // цена за единицу измерения
  shelfLife: number // дни
  minQuantity: number // минимальное количество для покупки
  maxQuantity?: number // максимальное (для акций)
}

interface StoreAvailability {
  storeId: string
  available: boolean
  price: number
  lastUpdated: Date
  section: string // отдел магазина
}
```

### Структура списка покупок
```typescript
interface ShoppingList {
  id: string
  familyId: string
  name: string
  createdDate: Date
  targetDate: Date
  store?: Store
  items: ShoppingItem[]
  totalEstimatedCost: number
  status: 'draft' | 'active' | 'completed'
}

interface ShoppingItem {
  id: string
  product: Product
  package: ProductPackage
  quantity: number
  requiredAmount: number // сколько нужно по рецептам
  requiredUnit: MeasurementUnit
  estimatedCost: number
  priority: 'essential' | 'important' | 'optional'
  source: ShoppingItemSource[] // откуда взялся этот товар
  alternatives: AlternativeOption[]
}

interface ShoppingItemSource {
  recipeId?: string
  mealId?: string
  ingredientId: string
  amount: number
  unit: MeasurementUnit
}

interface AlternativeOption {
  product: Product
  package: ProductPackage
  costDifference: number
  qualityScore: number
}
```

### Магазины и их особенности
```typescript
interface Store {
  id: string
  name: string
  chain: string
  location: StoreLocation
  sections: StoreSection[]
  features: StoreFeature[]
  priceLevel: 'budget' | 'medium' | 'premium'
}

interface StoreSection {
  id: string
  name: string
  order: number // порядок обхода
  categories: ProductCategory[]
}

type StoreFeature = 
  | 'online-ordering'
  | 'home-delivery'
  | 'organic-section'
  | 'bulk-buying'
  | 'fresh-bakery'
  | 'pharmacy'
```

## ВАРИАНТЫ АЛГОРИТМИЧЕСКИХ РЕШЕНИЙ

### Вариант 1: Простая агрегация по ингредиентам
**Описание:** Прямое суммирование ингредиентов из всех планов и поиск подходящих упаковок

**Алгоритм:**
```typescript
class SimplePackagingSystem {
  generateShoppingList(mealPlans: MealPlan[], targetStore?: Store): ShoppingList {
    // 1. Агрегация всех ингредиентов
    const aggregatedIngredients = this.aggregateIngredients(mealPlans)
    
    // 2. Поиск товаров для каждого ингредиента
    const shoppingItems: ShoppingItem[] = []
    
    for (const [ingredientId, totalAmount] of aggregatedIngredients) {
      const products = this.findProductsForIngredient(ingredientId, targetStore)
      const bestProduct = this.selectBestProduct(products, totalAmount)
      const package = this.selectBestPackage(bestProduct, totalAmount)
      
      shoppingItems.push({
        product: bestProduct,
        package: package,
        quantity: Math.ceil(totalAmount / package.size),
        requiredAmount: totalAmount,
        estimatedCost: package.price * Math.ceil(totalAmount / package.size)
      })
    }
    
    // 3. Группировка по отделам магазина
    const groupedItems = this.groupByStoreSection(shoppingItems, targetStore)
    
    return {
      items: shoppingItems,
      totalEstimatedCost: shoppingItems.reduce((sum, item) => sum + item.estimatedCost, 0),
      store: targetStore
    }
  }
  
  private aggregateIngredients(mealPlans: MealPlan[]): Map<string, number> {
    const aggregated = new Map<string, number>()
    
    for (const plan of mealPlans) {
      for (const meal of plan.meals) {
        for (const recipe of meal.recipes) {
          for (const ingredient of recipe.ingredients) {
            const currentAmount = aggregated.get(ingredient.id) || 0
            const gramsAmount = this.convertToGrams(ingredient.amount, ingredient.unit)
            aggregated.set(ingredient.id, currentAmount + gramsAmount)
          }
        }
      }
    }
    
    return aggregated
  }
  
  private selectBestPackage(product: Product, requiredAmount: number): ProductPackage {
    // Простая логика: выбираем упаковку с минимальными отходами
    let bestPackage = product.packages[0]
    let minWaste = Infinity
    
    for (const pkg of product.packages) {
      const packagesNeeded = Math.ceil(requiredAmount / pkg.size)
      const totalAmount = packagesNeeded * pkg.size
      const waste = totalAmount - requiredAmount
      const wastePercentage = waste / totalAmount
      
      if (wastePercentage < minWaste) {
        minWaste = wastePercentage
        bestPackage = pkg
      }
    }
    
    return bestPackage
  }
}
```

**Преимущества:**
- Простота реализации и понимания
- Быстрая работа
- Легкость отладки
- Минимальные требования к данным

**Недостатки:**
- Не учитывает срок годности
- Не оптимизирует стоимость
- Не предлагает альтернативы
- Простая логика выбора упаковок
- Не учитывает особенности хранения

**Временная сложность:** O(n*m) где n - планы, m - ингредиенты
**Пространственная сложность:** O(k) где k - уникальные ингредиенты
**Обработка граничных случаев:** Базовая
**Масштабируемость:** Высокая

### Вариант 2: Оптимизация с учетом стоимости и отходов
**Описание:** Интеллектуальная система, оптимизирующая выбор упаковок по нескольким критериям

**Алгоритм:**
```typescript
interface OptimizationCriteria {
  minimizeWaste: number      // вес критерия (0-1)
  minimizeCost: number       // вес критерия (0-1)
  preferLargerPackages: number // вес критерия (0-1)
  considerShelfLife: number  // вес критерия (0-1)
}

class OptimizedPackagingSystem {
  private criteria: OptimizationCriteria = {
    minimizeWaste: 0.4,
    minimizeCost: 0.3,
    preferLargerPackages: 0.2,
    considerShelfLife: 0.1
  }
  
  generateShoppingList(
    mealPlans: MealPlan[], 
    targetStore?: Store,
    preferences?: UserPreferences
  ): ShoppingList {
    // 1. Агрегация с учетом временных рамок
    const timeBasedAggregation = this.aggregateByTimeframe(mealPlans)
    
    // 2. Анализ потребления и планирование закупок
    const shoppingItems: ShoppingItem[] = []
    
    for (const [ingredientId, consumption] of timeBasedAggregation) {
      const optimizationResult = this.optimizePackageSelection(
        ingredientId,
        consumption,
        targetStore,
        preferences
      )
      
      shoppingItems.push(...optimizationResult.items)
    }
    
    // 3. Глобальная оптимизация (комбинированные покупки)
    const optimizedItems = this.globalOptimization(shoppingItems, targetStore)
    
    // 4. Добавление альтернатив
    const itemsWithAlternatives = this.addAlternatives(optimizedItems, targetStore)
    
    return {
      items: itemsWithAlternatives,
      totalEstimatedCost: this.calculateTotalCost(itemsWithAlternatives),
      store: targetStore,
      optimizationScore: this.calculateOptimizationScore(itemsWithAlternatives)
    }
  }
  
  private aggregateByTimeframe(mealPlans: MealPlan[]): Map<string, ConsumptionPattern> {
    const patterns = new Map<string, ConsumptionPattern>()
    
    for (const plan of mealPlans) {
      const planDate = new Date(plan.date)
      
      for (const meal of plan.meals) {
        for (const recipe of meal.recipes) {
          for (const ingredient of recipe.ingredients) {
            const pattern = patterns.get(ingredient.id) || {
              totalAmount: 0,
              consumptionDates: [],
              perishable: ingredient.perishable
            }
            
            pattern.totalAmount += this.convertToGrams(ingredient.amount, ingredient.unit)
            pattern.consumptionDates.push(planDate)
            patterns.set(ingredient.id, pattern)
          }
        }
      }
    }
    
    return patterns
  }
  
  private optimizePackageSelection(
    ingredientId: string,
    consumption: ConsumptionPattern,
    store?: Store,
    preferences?: UserPreferences
  ): OptimizationResult {
    const products = this.findProductsForIngredient(ingredientId, store)
    const allOptions: PackageOption[] = []
    
    // Генерация всех возможных комбинаций упаковок
    for (const product of products) {
      for (const pkg of product.packages) {
        const options = this.generatePackageCombinations(pkg, consumption.totalAmount)
        allOptions.push(...options.map(option => ({
          ...option,
          product,
          package: pkg,
          score: this.calculatePackageScore(option, consumption, preferences)
        })))
      }
    }
    
    // Выбор оптимальной комбинации
    const bestOption = allOptions.reduce((best, current) => 
      current.score > best.score ? current : best
    )
    
    return {
      items: this.convertToShoppingItems(bestOption),
      score: bestOption.score,
      alternatives: allOptions.slice(0, 3).filter(opt => opt !== bestOption)
    }
  }
  
  private calculatePackageScore(
    option: PackageOption,
    consumption: ConsumptionPattern,
    preferences?: UserPreferences
  ): number {
    let score = 0
    
    // Критерий минимизации отходов
    const wastePercentage = option.waste / option.totalAmount
    score += this.criteria.minimizeWaste * (1 - wastePercentage)
    
    // Критерий минимизации стоимости
    const costEfficiency = consumption.totalAmount / option.totalCost
    score += this.criteria.minimizeCost * costEfficiency
    
    // Критерий предпочтения больших упаковок (экономия)
    const packageSizeScore = Math.log(option.package.size) / 10
    score += this.criteria.preferLargerPackages * packageSizeScore
    
    // Критерий срока годности
    if (consumption.perishable) {
      const consumptionSpan = this.getConsumptionSpan(consumption.consumptionDates)
      const shelfLifeScore = Math.min(option.package.shelfLife / consumptionSpan, 1)
      score += this.criteria.considerShelfLife * shelfLifeScore
    }
    
    // Учет пользовательских предпочтений
    if (preferences) {
      score *= this.applyPreferences(option.product, preferences)
    }
    
    return score
  }
  
  private globalOptimization(items: ShoppingItem[], store?: Store): ShoppingItem[] {
    // Поиск возможностей для комбинированных покупок
    const optimizedItems = [...items]
    
    // Проверка акций и скидок за объем
    for (let i = 0; i < optimizedItems.length; i++) {
      const item = optimizedItems[i]
      const bulkOptions = this.findBulkOptions(item, store)
      
      if (bulkOptions.length > 0) {
        const bestBulkOption = this.selectBestBulkOption(item, bulkOptions)
        if (bestBulkOption.totalCost < item.estimatedCost) {
          optimizedItems[i] = bestBulkOption
        }
      }
    }
    
    // Объединение похожих товаров
    return this.consolidateSimilarItems(optimizedItems)
  }
  
  private addAlternatives(items: ShoppingItem[], store?: Store): ShoppingItem[] {
    return items.map(item => {
      const alternatives = this.findAlternatives(item.product, store)
      const rankedAlternatives = alternatives
        .map(alt => ({
          ...alt,
          costDifference: alt.package.price - item.package.price,
          qualityScore: this.calculateQualityScore(alt.product, item.product)
        }))
        .sort((a, b) => b.qualityScore - a.qualityScore)
        .slice(0, 3)
      
      return {
        ...item,
        alternatives: rankedAlternatives
      }
    })
  }
}

interface ConsumptionPattern {
  totalAmount: number
  consumptionDates: Date[]
  perishable: boolean
}

interface PackageOption {
  package: ProductPackage
  quantity: number
  totalAmount: number
  totalCost: number
  waste: number
  score?: number
}

interface OptimizationResult {
  items: ShoppingItem[]
  score: number
  alternatives: PackageOption[]
}
```

**Преимущества:**
- Интеллектуальная оптимизация по множественным критериям
- Учет срока годности и особенностей хранения
- Поиск альтернатив и комбинированных покупок
- Гибкая настройка критериев оптимизации
- Глобальная оптимизация всего списка

**Недостатки:**
- Высокая сложность реализации
- Требует много данных о товарах
- Сложность настройки весов критериев
- Высокие требования к производительности
- Сложность тестирования и отладки

**Временная сложность:** O(n*m*k²) где n - планы, m - ингредиенты, k - упаковки
**Пространственная сложность:** O(n*m*k)
**Обработка граничных случаев:** Хорошая
**Масштабируемость:** Средняя (требует оптимизации)

### Вариант 3: Машинное обучение для персонализации
**Описание:** Система с элементами машинного обучения для персонализации рекомендаций

**Алгоритм:**
```typescript
interface UserBehaviorData {
  userId: string
  purchaseHistory: PurchaseRecord[]
  preferences: UserPreferences
  budgetConstraints: BudgetConstraints
  shoppingPatterns: ShoppingPattern[]
}

interface PurchaseRecord {
  date: Date
  items: ShoppingItem[]
  store: Store
  totalCost: number
  satisfaction: number // 1-5, обратная связь от пользователя
}

class MLPackagingSystem extends OptimizedPackagingSystem {
  private behaviorAnalyzer: UserBehaviorAnalyzer
  private recommendationEngine: RecommendationEngine
  private feedbackProcessor: FeedbackProcessor
  
  generatePersonalizedShoppingList(
    mealPlans: MealPlan[],
    user: User,
    targetStore?: Store
  ): PersonalizedShoppingList {
    // 1. Анализ поведения пользователя
    const behaviorProfile = this.behaviorAnalyzer.analyzeUser(user)
    
    // 2. Персонализированные критерии оптимизации
    const personalizedCriteria = this.adaptCriteriaToUser(behaviorProfile)
    
    // 3. Базовая оптимизация с персонализированными критериями
    const baseList = this.generateShoppingList(mealPlans, targetStore, {
      criteria: personalizedCriteria,
      preferences: behaviorProfile.preferences
    })
    
    // 4. ML-рекомендации
    const mlRecommendations = this.recommendationEngine.generateRecommendations(
      baseList,
      behaviorProfile,
      targetStore
    )
    
    // 5. Интеграция рекомендаций
    const enhancedList = this.integrateMLRecommendations(baseList, mlRecommendations)
    
    return {
      ...enhancedList,
      personalizedScore: this.calculatePersonalizationScore(enhancedList, behaviorProfile),
      learningInsights: this.generateLearningInsights(behaviorProfile),
      feedbackRequest: this.generateFeedbackRequest(enhancedList)
    }
  }
  
  private adaptCriteriaToUser(profile: UserBehaviorProfile): OptimizationCriteria {
    const baseCriteria = this.criteria
    
    // Адаптация на основе истории покупок
    if (profile.budgetSensitive) {
      baseCriteria.minimizeCost *= 1.5
      baseCriteria.minimizeWaste *= 0.8
    }
    
    if (profile.qualityFocused) {
      baseCriteria.minimizeCost *= 0.7
      baseCriteria.preferLargerPackages *= 1.3
    }
    
    if (profile.ecoFriendly) {
      baseCriteria.minimizeWaste *= 1.4
      baseCriteria.preferLargerPackages *= 1.2
    }
    
    return baseCriteria
  }
  
  processFeedback(feedback: UserFeedback): void {
    // Обновление модели на основе обратной связи
    this.feedbackProcessor.processFeedback(feedback)
    
    // Корректировка весов критериев
    this.adjustCriteriaWeights(feedback)
    
    // Обновление рекомендательной модели
    this.recommendationEngine.updateModel(feedback)
  }
}

class UserBehaviorAnalyzer {
  analyzeUser(user: User): UserBehaviorProfile {
    const history = this.getUserHistory(user.id)
    
    return {
      budgetSensitive: this.analyzeBudgetSensitivity(history),
      qualityFocused: this.analyzeQualityFocus(history),
      ecoFriendly: this.analyzeEcoFriendliness(history),
      brandLoyal: this.analyzeBrandLoyalty(history),
      shoppingFrequency: this.analyzeShoppingFrequency(history),
      preferredStores: this.analyzeStorePreferences(history),
      seasonalPatterns: this.analyzeSeasonalPatterns(history)
    }
  }
  
  private analyzeBudgetSensitivity(history: PurchaseRecord[]): number {
    // Анализ корреляции между ценой и выбором товаров
    const priceChoices = history.map(record => {
      return record.items.map(item => ({
        chosenPrice: item.package.pricePerUnit,
        availableAlternatives: item.alternatives?.map(alt => alt.package.pricePerUnit) || []
      }))
    }).flat()
    
    // Расчет склонности к выбору более дешевых вариантов
    let budgetChoices = 0
    let totalChoices = 0
    
    for (const choice of priceChoices) {
      if (choice.availableAlternatives.length > 0) {
        const cheapestAlternative = Math.min(...choice.availableAlternatives)
        if (choice.chosenPrice <= cheapestAlternative * 1.1) { // 10% tolerance
          budgetChoices++
        }
        totalChoices++
      }
    }
    
    return totalChoices > 0 ? budgetChoices / totalChoices : 0.5
  }
}

class RecommendationEngine {
  generateRecommendations(
    baseList: ShoppingList,
    profile: UserBehaviorProfile,
    store?: Store
  ): MLRecommendation[] {
    const recommendations: MLRecommendation[] = []
    
    // Рекомендации на основе сезонности
    recommendations.push(...this.generateSeasonalRecommendations(baseList, profile))
    
    // Рекомендации на основе истории покупок
    recommendations.push(...this.generateHistoryBasedRecommendations(baseList, profile))
    
    // Рекомендации на основе поведения похожих пользователей
    recommendations.push(...this.generateCollaborativeRecommendations(baseList, profile))
    
    return recommendations.sort((a, b) => b.confidence - a.confidence)
  }
}
```

**Преимущества:**
- Персонализация рекомендаций
- Обучение на основе обратной связи
- Учет сложных поведенческих паттернов
- Улучшение качества рекомендаций со временем
- Возможность предсказания потребностей

**Недостатки:**
- Очень высокая сложность реализации
- Требует большие объемы данных для обучения
- Сложность интерпретации результатов
- Высокие требования к инфраструктуре
- Проблемы с приватностью данных
- Длительный период "холодного старта"

**Временная сложность:** O(n*m*k² + ML_complexity)
**Пространственная сложность:** O(n*m*k + model_size)
**Обработка граничных случаев:** Отличная
**Масштабируемость:** Низкая (требует специализированной инфраструктуры)

## 🎨 CREATIVE CHECKPOINT: Анализ подходов к системе фасовки завершен

**Прогресс:** Определены 3 уровня сложности системы фасовки продуктов
**Решения:** Проанализированы компромиссы между простотой и интеллектуальностью
**Следующие шаги:** Выбор оптимального решения и детализация архитектуры

## РЕШЕНИЕ

**Выбранный вариант:** Вариант 2 - Оптимизация с учетом стоимости и отходов

**Обоснование:**
1. **Баланс функциональности и сложности:** Достаточно мощный для решения основных задач
2. **Практическая применимость:** Не требует больших объемов данных для ML
3. **Измеримые результаты:** Четкие критерии оптимизации
4. **Техническая реализуемость:** Сложность на приемлемом уровне
5. **Расширяемость:** Можно добавить ML-компоненты в будущем
6. **Пользовательская ценность:** Реальная экономия денег и снижение отходов

**Элементы из Варианта 3 для будущего развития:**
- Сбор данных о поведении пользователей
- Простая система обратной связи
- Базовая персонализация критериев

## ДЕТАЛЬНАЯ АРХИТЕКТУРА РЕШЕНИЯ

### Основные компоненты системы

```typescript
// Главный сервис фасовки
export class PackagingService {
  private productCatalog: ProductCatalogService
  private optimizer: PackageOptimizer
  private storeService: StoreService
  private priceService: PriceService
  
  async generateShoppingList(
    mealPlans: MealPlan[],
    options: ShoppingListOptions
  ): Promise<ShoppingList>
  
  async optimizeExistingList(
    list: ShoppingList,
    newCriteria: OptimizationCriteria
  ): Promise<ShoppingList>
  
  async findAlternatives(
    item: ShoppingItem,
    store?: Store
  ): Promise<AlternativeOption[]>
}

// Каталог товаров
export class ProductCatalogService {
  async findProductsForIngredient(
    ingredientId: string,
    store?: Store
  ): Promise<Product[]>
  
  async getProductDetails(productId: string): Promise<Product>
  async updateProductAvailability(storeId: string, updates: AvailabilityUpdate[]): Promise<void>
  async searchProducts(query: string, filters: ProductFilter[]): Promise<Product[]>
}

// Оптимизатор упаковок
export class PackageOptimizer {
  private criteria: OptimizationCriteria
  
  optimizePackageSelection(
    ingredient: IngredientRequirement,
    availableProducts: Product[],
    constraints: OptimizationConstraints
  ): OptimizationResult
  
  calculatePackageScore(
    option: PackageOption,
    requirements: IngredientRequirement
  ): number
  
  findBulkOpportunities(items: ShoppingItem[]): BulkOpportunity[]
}

// Сервис магазинов
export class StoreService {
  async getStoreInfo(storeId: string): Promise<Store>
  async getStoresNearLocation(location: Location): Promise<Store[]>
  async getStoreSections(storeId: string): Promise<StoreSection[]>
  async optimizeShoppingRoute(items: ShoppingItem[], store: Store): Promise<ShoppingRoute>
}

// Сервис цен
export class PriceService {
  async getCurrentPrices(productIds: string[], storeId: string): Promise<PriceInfo[]>
  async getPriceHistory(productId: string, days: number): Promise<PriceHistory>
  async findBestPrices(productIds: string[], stores: Store[]): Promise<BestPriceInfo[]>
  async trackPriceChanges(productIds: string[]): Promise<void>
}
```

### Алгоритм оптимизации упаковок

```typescript
class PackageOptimizer {
  optimizePackageSelection(
    ingredient: IngredientRequirement,
    availableProducts: Product[],
    constraints: OptimizationConstraints
  ): OptimizationResult {
    const allOptions: ScoredPackageOption[] = []
    
    // Генерация всех возможных комбинаций
    for (const product of availableProducts) {
      if (!this.meetsConstraints(product, constraints)) continue
      
      for (const pkg of product.packages) {
        const combinations = this.generateCombinations(pkg, ingredient.amount)
        
        for (const combination of combinations) {
          const score = this.calculateScore(combination, ingredient, constraints)
          allOptions.push({ ...combination, product, package: pkg, score })
        }
      }
    }
    
    // Сортировка по оценке
    allOptions.sort((a, b) => b.score - a.score)
    
    return {
      bestOption: allOptions[0],
      alternatives: allOptions.slice(1, 4),
      allOptions: allOptions
    }
  }
  
  private generateCombinations(pkg: ProductPackage, requiredAmount: number): PackageCombination[] {
    const combinations: PackageCombination[] = []
    const maxPackages = Math.ceil(requiredAmount / pkg.size) + 2 // +2 для альтернатив
    
    for (let quantity = 1; quantity <= maxPackages; quantity++) {
      const totalAmount = quantity * pkg.size
      if (totalAmount >= requiredAmount) {
        combinations.push({
          quantity,
          totalAmount,
          totalCost: quantity * pkg.price,
          waste: totalAmount - requiredAmount,
          wastePercentage: (totalAmount - requiredAmount) / totalAmount
        })
      }
    }
    
    return combinations
  }
  
  private calculateScore(
    combination: PackageCombination,
    requirement: IngredientRequirement,
    constraints: OptimizationConstraints
  ): number {
    let score = 0
    
    // Минимизация отходов (0-40 баллов)
    const wasteScore = Math.max(0, 40 * (1 - combination.wastePercentage))
    score += wasteScore * this.criteria.minimizeWaste
    
    // Минимизация стоимости (0-30 баллов)
    const costEfficiency = requirement.amount / combination.totalCost
    const costScore = Math.min(30, costEfficiency * 100)
    score += costScore * this.criteria.minimizeCost
    
    // Предпочтение больших упаковок (0-20 баллов)
    const sizeScore = Math.min(20, Math.log10(combination.package.size) * 5)
    score += sizeScore * this.criteria.preferLargerPackages
    
    // Срок годности (0-10 баллов)
    if (requirement.perishable) {
      const shelfLifeScore = Math.min(10, combination.package.shelfLife / requirement.consumptionDays * 10)
      score += shelfLifeScore * this.criteria.considerShelfLife
    }
    
    // Штрафы за нарушение ограничений
    if (combination.totalCost > constraints.maxBudget) {
      score *= 0.5 // Серьезный штраф за превышение бюджета
    }
    
    if (combination.wastePercentage > constraints.maxWastePercentage) {
      score *= 0.8 // Штраф за превышение допустимых отходов
    }
    
    return score
  }
}
```

### Система группировки и маршрутизации

```typescript
class ShoppingRouteOptimizer {
  optimizeShoppingRoute(items: ShoppingItem[], store: Store): ShoppingRoute {
    // Группировка по отделам магазина
    const groupedItems = this.groupBySection(items, store)
    
    // Оптимизация порядка обхода отделов
    const optimizedSections = this.optimizeSectionOrder(groupedItems, store)
    
    // Создание детального маршрута
    const route = this.createDetailedRoute(optimizedSections, store)
    
    return {
      sections: optimizedSections,
      estimatedTime: this.calculateEstimatedTime(route),
      totalDistance: this.calculateTotalDistance(route),
      items: items
    }
  }
  
  private groupBySection(items: ShoppingItem[], store: Store): Map<StoreSection, ShoppingItem[]> {
    const grouped = new Map<StoreSection, ShoppingItem[]>()
    
    for (const item of items) {
      const section = this.findSectionForProduct(item.product, store)
      if (!grouped.has(section)) {
        grouped.set(section, [])
      }
      grouped.get(section)!.push(item)
    }
    
    return grouped
  }
  
  private optimizeSectionOrder(grouped: Map<StoreSection, ShoppingItem[]>, store: Store): StoreSection[] {
    const sections = Array.from(grouped.keys())
    
    // Простая эвристика: сортировка по порядку в магазине
    sections.sort((a, b) => a.order - b.order)
    
    // Оптимизация для скоропортящихся товаров (в конце)
    const perishableSections = sections.filter(section => 
      grouped.get(section)!.some(item => this.isPerishable(item.product))
    )
    
    const nonPerishableSections = sections.filter(section => 
      !perishableSections.includes(section)
    )
    
    return [...nonPerishableSections, ...perishableSections]
  }
}
```

### Система альтернатив и рекомендаций

```typescript
class AlternativeRecommendationService {
  findAlternatives(item: ShoppingItem, store?: Store): AlternativeOption[] {
    const alternatives: AlternativeOption[] = []
    
    // Альтернативы по бренду
    alternatives.push(...this.findBrandAlternatives(item, store))
    
    // Альтернативы по размеру упаковки
    alternatives.push(...this.findSizeAlternatives(item, store))
    
    // Альтернативы по цене
    alternatives.push(...this.findPriceAlternatives(item, store))
    
    // Органические/эко альтернативы
    alternatives.push(...this.findEcoAlternatives(item, store))
    
    return this.rankAlternatives(alternatives, item)
  }
  
  private rankAlternatives(alternatives: AlternativeOption[], originalItem: ShoppingItem): AlternativeOption[] {
    return alternatives
      .map(alt => ({
        ...alt,
        score: this.calculateAlternativeScore(alt, originalItem)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5) // Топ 5 альтернатив
  }
  
  private calculateAlternativeScore(alternative: AlternativeOption, original: ShoppingItem): number {
    let score = 0
    
    // Сравнение цены
    const priceDifference = (alternative.package.price - original.package.price) / original.package.price
    if (priceDifference < 0) {
      score += Math.abs(priceDifference) * 30 // Бонус за более низкую цену
    } else {
      score -= priceDifference * 20 // Штраф за более высокую цену
    }
    
    // Качество бренда
    score += alternative.qualityScore * 25
    
    // Соответствие размера упаковки
    const sizeRatio = alternative.package.size / original.package.size
    const sizeScore = 1 - Math.abs(1 - sizeRatio) // Ближе к 1 = лучше
    score += sizeScore * 20
    
    // Доступность в магазине
    if (alternative.product.stores.some(store => store.available)) {
      score += 15
    }
    
    return Math.max(0, score)
  }
}
```

### API для интеграции с UI

```typescript
export class ShoppingListAPI {
  // Основные методы
  async generateShoppingList(request: GenerateListRequest): Promise<ShoppingListResponse>
  async optimizeShoppingList(listId: string, criteria: OptimizationCriteria): Promise<ShoppingList>
  async addItemToList(listId: string, item: ShoppingItemRequest): Promise<ShoppingItem>
  async removeItemFromList(listId: string, itemId: string): Promise<void>
  async updateItemQuantity(listId: string, itemId: string, quantity: number): Promise<ShoppingItem>
  
  // Альтернативы и рекомендации
  async getAlternatives(itemId: string, storeId?: string): Promise<AlternativeOption[]>
  async getRecommendations(listId: string): Promise<Recommendation[]>
  async applyRecommendation(listId: string, recommendationId: string): Promise<ShoppingList>
  
  // Магазины и маршруты
  async getOptimalStores(listId: string, location: Location): Promise<StoreRecommendation[]>
  async generateShoppingRoute(listId: string, storeId: string): Promise<ShoppingRoute>
  async estimateShoppingTime(listId: string, storeId: string): Promise<TimeEstimate>
  
  // Аналитика
  async getShoppingStats(familyId: string, period: TimePeriod): Promise<ShoppingStats>
  async getCostAnalysis(listId: string): Promise<CostAnalysis>
  async getWasteAnalysis(familyId: string, period: TimePeriod): Promise<WasteAnalysis>
}

// Типы для API
interface GenerateListRequest {
  mealPlans: MealPlan[]
  familyId: string
  targetStore?: string
  preferences?: UserPreferences
  constraints?: OptimizationConstraints
}

interface ShoppingListResponse {
  list: ShoppingList
  optimizationScore: number
  estimatedSavings: number
  wasteReduction: number
  recommendations: Recommendation[]
}

interface StoreRecommendation {
  store: Store
  estimatedCost: number
  estimatedTime: number
  distance: number
  availabilityScore: number
  overallScore: number
}
```

## ВАЛИДАЦИЯ ТРЕБОВАНИЙ

**Функциональные требования выполнены:**
- ✅ Преобразование ингредиентов в товары для покупки
- ✅ Учет реальных упаковок товаров
- ✅ Группировка по категориям и отделам
- ✅ Оптимизация количества упаковок
- ✅ Учет срока годности
- ✅ Альтернативные товары и бренды
- ✅ Расчет примерной стоимости
- ✅ Поддержка различных магазинов

**Бизнес-требования выполнены:**
- ✅ Снижение пищевых отходов
- ✅ Оптимизация бюджета
- ✅ Удобство планирования
- ✅ Семейное планирование
- ✅ Учет предпочтений и ограничений

**Техническая осуществимость:** Высокая
**Оценка сложности:** Средняя (управляемая)

## ПЛАН РЕАЛИЗАЦИИ

### Этап 1: Базовая функциональность
1. Создание моделей данных (Product, Package, Store)
2. Простой алгоритм агрегации ингредиентов
3. Базовый выбор упаковок
4. Группировка по отделам магазина

### Этап 2: Оптимизация
1. Реализация системы оценки упаковок
2. Многокритериальная оптимизация
3. Система конвертации единиц измерения
4. Обработка ошибок и валидация

### Этап 3: Альтернативы и рекомендации
1. Поиск альтернативных товаров
2. Система рекомендаций
3. Оптимизация маршрутов по магазину
4. Интеграция с ценовыми данными

### Этап 4: Аналитика и улучшения
1. Аналитика покупок и отходов
2. Система обратной связи
3. Оптимизация производительности
4. Подготовка к ML-расширениям

🎨🎨🎨 EXITING CREATIVE PHASE - РЕШЕНИЕ ПРИНЯТО 🎨🎨🎨

**Краткое описание:** Выбрана система оптимизации с учетом стоимости и отходов для практичного решения задач фасовки
**Ключевые решения:**
- Многокритериальная оптимизация упаковок
- Интеллектуальный поиск альтернатив
- Система группировки и маршрутизации
- Гибкая архитектура для будущих расширений
- Практичный API для интеграции с UI

**Следующие шаги:** Все компоненты прошли творческую фазу, переход к режиму IMPLEMENT