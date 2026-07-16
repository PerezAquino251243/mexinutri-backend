import { getIngredientRepository } from '../../ingredients/repositories/ingredient.repository';
import { type NutritionResponseDto } from '../dto/nutrition-response.dto';

export interface NutritionCalculationInput {
  ingredientId: number;
  quantity: number;
}

export class NutritionService {
  private get ingredientRepository() {
    return getIngredientRepository();
  }

  public async calculate(input: NutritionCalculationInput[]): Promise<NutritionResponseDto> {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    const items: NutritionResponseDto['items'] = [];

    for (const item of input) {
      const ingredient = await this.ingredientRepository.findById(item.ingredientId);
      if (!ingredient) {
        throw new Error(`Ingredient with id '${item.ingredientId}' not found`);
      }

      const multiplier = item.quantity / this.getBaseQuantityValue(ingredient);

      const itemCalories = ingredient.calories * multiplier;
      const itemProtein = ingredient.protein * multiplier;
      const itemCarbs = ingredient.carbs * multiplier;
      const itemFat = ingredient.fat * multiplier;

      items.push({
        ingredientId: ingredient.id,
        name: ingredient.name,
        quantity: item.quantity,
        unit: ingredient.unit,
        nutrition: {
          calories: Number(itemCalories.toFixed(2)),
          protein: Number(itemProtein.toFixed(2)),
          carbs: Number(itemCarbs.toFixed(2)),
          fat: Number(itemFat.toFixed(2)),
        },
      });

      totalCalories += itemCalories;
      totalProtein += itemProtein;
      totalCarbs += itemCarbs;
      totalFat += itemFat;
    }

    return {
      items,
      total: {
        calories: Number(totalCalories.toFixed(2)),
        protein: Number(totalProtein.toFixed(2)),
        carbs: Number(totalCarbs.toFixed(2)),
        fat: Number(totalFat.toFixed(2)),
      },
    };
  }

  private getBaseQuantityValue(ingredient: { unit: string; baseAmount: string }): number {
    if (ingredient.unit === 'g') {
      return 100;
    }

    if (ingredient.unit === 'pieza') {
      return 1;
    }

    return Number(ingredient.baseAmount.match(/\d+/)?.[0] ?? 1);
  }
}