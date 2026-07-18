import { getDishRepository } from '../../dishes/repositories/dish.repository';
import { getIngredientRepository } from '../../ingredients/repositories/ingredient.repository';
import { type MealPlanResponseDto, type MealPlanItemDto } from '../dto/meal-plan-response.dto';

export class MealPlanService {
  private get dishRepository() {
    return getDishRepository();
  }

  private get ingredientRepository() {
    return getIngredientRepository();
  }

  public async generate(targetCalories: number, numberOfMeals?: number): Promise<MealPlanResponseDto> {
    const mealsToGenerate = numberOfMeals ?? 3;
    const targetPerMeal = targetCalories / mealsToGenerate;

    const allDishes = await this.dishRepository.findAll();

    const dishesWithNutrition = await Promise.all(
      allDishes.map(async (dish) => ({
        dish,
        nutrition: await this.calculateDishNutrition(dish),
      })),
    );

    const eligibleDishes = dishesWithNutrition.filter(
      (d) =>
        d.nutrition.calories <= targetPerMeal * 1.5 &&
        d.nutrition.calories >= targetPerMeal * 0.3,
    );

    const shuffledDishes = this.shuffle([...eligibleDishes]);

    const meals: MealPlanItemDto[] = [];
    const usedDishIds = new Set<number>();
    let totalNutrition = { calories: 0, protein: 0, carbs: 0, fat: 0 };

    for (let i = 0; i < mealsToGenerate && shuffledDishes.length > 0; i++) {
      const suitableDish = shuffledDishes.find(
        (d) => !usedDishIds.has(d.dish.id),
      );

      if (suitableDish) {
        usedDishIds.add(suitableDish.dish.id);

        meals.push({
          type: 'dish',
          name: suitableDish.dish.name,
          dishId: suitableDish.dish.id,
          imageUrl: suitableDish.dish.imageUrl,
          ingredients: suitableDish.dish.ingredients.map((ing) => ({
            ingredientId: ing.ingredientId,
            name: ing.name,
            quantity: ing.quantity,
            unit: ing.unit,
          })),
          nutrition: suitableDish.nutrition,
        });

        totalNutrition.calories += suitableDish.nutrition.calories;
        totalNutrition.protein += suitableDish.nutrition.protein;
        totalNutrition.carbs += suitableDish.nutrition.carbs;
        totalNutrition.fat += suitableDish.nutrition.fat;
      }
    }

    if (totalNutrition.calories < targetCalories) {
      const scale = targetCalories / totalNutrition.calories;
      this.scaleMealPlan(meals, scale);
      totalNutrition.calories = targetCalories;
      totalNutrition.protein *= scale;
      totalNutrition.carbs *= scale;
      totalNutrition.fat *= scale;
    }

    return {
      targetCalories,
      meals,
      total: {
        calories: Number(totalNutrition.calories.toFixed(2)),
        protein: Number(totalNutrition.protein.toFixed(2)),
        carbs: Number(totalNutrition.carbs.toFixed(2)),
        fat: Number(totalNutrition.fat.toFixed(2)),
      },
    };
  }

  private async calculateDishNutrition(dish: {
    ingredients: { ingredientId: number; quantity: number }[];
  }): Promise<{ calories: number; protein: number; carbs: number; fat: number }> {
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;

    for (const ingRef of dish.ingredients) {
      const ingredient = await this.ingredientRepository.findById(ingRef.ingredientId);
      if (!ingredient) continue;

      const multiplier = ingRef.quantity / this.getBaseQuantityValue(ingredient);
      calories += ingredient.calories * multiplier;
      protein += ingredient.protein * multiplier;
      carbs += ingredient.carbs * multiplier;
      fat += ingredient.fat * multiplier;
    }

    return {
      calories: Number(calories.toFixed(2)),
      protein: Number(protein.toFixed(2)),
      carbs: Number(carbs.toFixed(2)),
      fat: Number(fat.toFixed(2)),
    };
  }

  private getBaseQuantityValue(ingredient: { unit: string; baseAmount: string }): number {
    if (ingredient.unit === 'g') return 100;
    if (ingredient.unit === 'pieza') return 1;
    return Number(ingredient.baseAmount.match(/\d+/)?.[0] ?? 1);
  }

  private shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i] as T;
      array[i] = array[j] as T;
      array[j] = temp;
    }
    return array;
  }

  private scaleMealPlan(meals: MealPlanItemDto[], scale: number): void {
    for (const meal of meals) {
      if (meal.ingredients) {
        for (const ingredient of meal.ingredients) {
          ingredient.quantity = Math.round(ingredient.quantity * scale);
        }
      }
      meal.nutrition.calories = Number((meal.nutrition.calories * scale).toFixed(2));
      meal.nutrition.protein = Number((meal.nutrition.protein * scale).toFixed(2));
      meal.nutrition.carbs = Number((meal.nutrition.carbs * scale).toFixed(2));
      meal.nutrition.fat = Number((meal.nutrition.fat * scale).toFixed(2));
    }
  }
}
