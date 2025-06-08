-- CreateTable
CREATE TABLE "unplanned_meals" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "calories" DOUBLE PRECISION NOT NULL,
    "protein" DOUBLE PRECISION NOT NULL,
    "carbs" DOUBLE PRECISION NOT NULL,
    "fat" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "unplanned_meals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meal_unplanned_meals" (
    "mealId" TEXT NOT NULL,
    "unplannedMealId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "meal_unplanned_meals_pkey" PRIMARY KEY ("mealId","unplannedMealId")
);

-- CreateIndex
CREATE UNIQUE INDEX "unplanned_meals_name_key" ON "unplanned_meals"("name");

-- AddForeignKey
ALTER TABLE "meal_unplanned_meals" ADD CONSTRAINT "meal_unplanned_meals_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "meals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_unplanned_meals" ADD CONSTRAINT "meal_unplanned_meals_unplannedMealId_fkey" FOREIGN KEY ("unplannedMealId") REFERENCES "unplanned_meals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
