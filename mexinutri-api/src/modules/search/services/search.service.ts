import { getDishRepository } from '../../dishes/repositories/dish.repository';
import { getIngredientRepository } from '../../ingredients/repositories/ingredient.repository';
import { type SearchResponseDto, type SearchIngredientDetailDto } from '../dto/search.dto';

export class SearchService {
  private get ingredientRepository() {
    return getIngredientRepository();
  }

  private get dishRepository() {
    return getDishRepository();
  }

  public async search(query: string): Promise<SearchResponseDto> {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return {
        query,
        results: [],
      };
    }

    const ingredients = await this.ingredientRepository.findByQuery(normalizedQuery);
    const dishes = await this.dishRepository.findByQuery(normalizedQuery);

    const results = [
      ...ingredients.map((ingredient) => ({
        type: 'ingredient' as const,
        id: ingredient.id,
        name: ingredient.name,
        description: ingredient.description,
        category: ingredient.category,
        tags: ingredient.tags,
        calories: ingredient.calories,
        protein: ingredient.protein,
        carbs: ingredient.carbs,
        fat: ingredient.fat,
      })),
      ...(await Promise.all(
        dishes.map(async (dish) => {
          const ingredientDetails: SearchIngredientDetailDto[] = [];
          let totalCalories = 0;
          let totalProtein = 0;
          let totalCarbs = 0;
          let totalFat = 0;

          for (const ing of dish.ingredients) {
            const fullIngredient = await this.ingredientRepository.findById(ing.ingredientId);
            if (!fullIngredient) continue;

            const baseValue = this.getBaseQuantityValue(fullIngredient);
            const multiplier = ing.quantity / baseValue;
            const ingCalories = +((fullIngredient.calories * multiplier).toFixed(2));
            const ingProtein = +((fullIngredient.protein * multiplier).toFixed(2));
            const ingCarbs = +((fullIngredient.carbs * multiplier).toFixed(2));
            const ingFat = +((fullIngredient.fat * multiplier).toFixed(2));

            ingredientDetails.push({
              ingredientId: ing.ingredientId,
              name: ing.name,
              quantity: ing.quantity,
              unit: ing.unit,
              calories: ingCalories,
              protein: ingProtein,
              carbs: ingCarbs,
              fat: ingFat,
            });

            totalCalories += ingCalories;
            totalProtein += ingProtein;
            totalCarbs += ingCarbs;
            totalFat += ingFat;
          }

          return {
            type: 'dish' as const,
            id: dish.id,
            name: dish.name,
            description: dish.description,
            category: dish.category,
            tags: dish.tags,
            imageUrl: dish.imageUrl,
            calories: +totalCalories.toFixed(2),
            protein: +totalProtein.toFixed(2),
            carbs: +totalCarbs.toFixed(2),
            fat: +totalFat.toFixed(2),
            ingredients: ingredientDetails,
          };
        }),
      )),
    ];

    return {
      query,
      results,
    };
  }

  private getBaseQuantityValue(ingredient: { unit: string; baseAmount: string }): number {
    if (ingredient.unit === 'g') return 100;
    if (ingredient.unit === 'pieza') return 1;
    return Number(ingredient.baseAmount.match(/\d+/)?.[0] ?? 1);
  }
}
