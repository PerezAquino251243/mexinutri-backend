import { type IngredientRepository, getIngredientRepository } from '../../ingredients/repositories/ingredient.repository';
import { type DishResponseDto, type DishIngredientDto } from '../dto/dish.dto';
import { type DishEntity, type DishIngredientEntity } from '../entities/dish.entity';
import { type DishRepository, getDishRepository } from '../repositories/dish.repository';

export interface CreateDishInput {
  name: string;
  description: string;
  category: string;
  tags: string[];
  ingredients: { ingredientId: number; quantity: number }[];
  imageUrl?: string;
}

export interface UpdateDishInput {
  name?: string;
  description?: string;
  category?: string;
  tags?: string[];
  ingredients?: { ingredientId: number; quantity: number }[];
  imageUrl?: string;
}

export class DishService {
  private get dishRepository(): DishRepository {
    return getDishRepository();
  }

  private get ingredientRepository(): IngredientRepository {
    return getIngredientRepository();
  }

  public async listDishes(search?: string): Promise<DishResponseDto[]> {
    const dishes = search
      ? await this.dishRepository.findByQuery(search)
      : await this.dishRepository.findAll();

    return Promise.all(dishes.map((dish) => this.mapToResponse(dish)));
  }

  public async getDishById(id: number): Promise<DishResponseDto | null> {
    const dish = await this.dishRepository.findById(id);

    if (!dish) {
      return null;
    }

    return this.mapToResponse(dish);
  }

  public async createDish(data: CreateDishInput): Promise<DishResponseDto> {
    const resolvedIngredients: DishIngredientEntity[] = [];

    for (const item of data.ingredients) {
      const ingredient = await this.ingredientRepository.findById(item.ingredientId);
      if (!ingredient) {
        throw new Error(`Ingredient with id '${item.ingredientId}' not found`);
      }

      resolvedIngredients.push({
        ingredientId: ingredient.id,
        name: ingredient.name,
        quantity: item.quantity,
        unit: ingredient.unit,
      });
    }

    const dish = await this.dishRepository.create({
      name: data.name,
      description: data.description,
      category: data.category,
      tags: data.tags,
      ingredients: resolvedIngredients,
      imageUrl: data.imageUrl,
    });

    return this.mapToResponse(dish);
  }

  public async updateDish(id: number, data: UpdateDishInput): Promise<DishResponseDto | null> {
    const existingDish = await this.dishRepository.findById(id);
    if (!existingDish) {
      return null;
    }

    const updateData: Partial<DishEntity> = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;

    if (data.ingredients !== undefined) {
      const resolvedIngredients: DishIngredientEntity[] = [];

      for (const item of data.ingredients) {
        const ingredient = await this.ingredientRepository.findById(item.ingredientId);
        if (!ingredient) {
          throw new Error(`Ingredient with id '${item.ingredientId}' not found`);
        }

        resolvedIngredients.push({
          ingredientId: ingredient.id,
          name: ingredient.name,
          quantity: item.quantity,
          unit: ingredient.unit,
        });
      }

      updateData.ingredients = resolvedIngredients;
    }

    const updated = await this.dishRepository.update(id, updateData);
    if (!updated) {
      return null;
    }

    return this.mapToResponse(updated);
  }

  public async deleteDish(id: number): Promise<boolean> {
    return this.dishRepository.delete(id);
  }

  private async mapToResponse(dish: DishEntity): Promise<DishResponseDto> {
    const { ingredients, nutrition } = await this.calculateNutrition(dish);

    return {
      id: dish.id,
      name: dish.name,
      description: dish.description,
      category: dish.category,
      tags: dish.tags,
      ingredients,
      imageUrl: dish.imageUrl,
      nutrition,
    };
  }

  private async calculateNutrition(dish: DishEntity) {
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;
    const ingredients: DishIngredientDto[] = [];

    for (const ingredientRef of dish.ingredients) {
      const ingredient = await this.ingredientRepository.findById(ingredientRef.ingredientId);
      if (!ingredient) {
        continue;
      }

      const multiplier = ingredientRef.quantity / this.getBaseQuantityValue(ingredient);
      const ingCalories = Number((ingredient.calories * multiplier).toFixed(2));
      const ingProtein = Number((ingredient.protein * multiplier).toFixed(2));
      const ingCarbs = Number((ingredient.carbs * multiplier).toFixed(2));
      const ingFat = Number((ingredient.fat * multiplier).toFixed(2));

      ingredients.push({
        ingredientId: ingredientRef.ingredientId,
        name: ingredientRef.name,
        quantity: ingredientRef.quantity,
        unit: ingredientRef.unit,
        calories: ingCalories,
        protein: ingProtein,
        carbs: ingCarbs,
        fat: ingFat,
      });

      calories += ingCalories;
      protein += ingProtein;
      carbs += ingCarbs;
      fat += ingFat;
    }

    return {
      ingredients,
      nutrition: {
        calories: Number(calories.toFixed(2)),
        protein: Number(protein.toFixed(2)),
        carbs: Number(carbs.toFixed(2)),
        fat: Number(fat.toFixed(2)),
      },
    };
  }

  private getBaseQuantityValue(ingredient: { unit: string; baseAmount: string }) {
    if (ingredient.unit === 'g') {
      return 100;
    }

    if (ingredient.unit === 'pieza') {
      return 1;
    }

    return Number(ingredient.baseAmount.match(/\d+/)?.[0] ?? 1);
  }
}