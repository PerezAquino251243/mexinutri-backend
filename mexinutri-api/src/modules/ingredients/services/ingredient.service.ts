import { type IngredientResponseDto } from '../dto/ingredient.dto';
import { type IngredientEntity } from '../entities/ingredient.entity';
import {
  type IngredientRepository,
  getIngredientRepository,
} from '../repositories/ingredient.repository';

export class IngredientService {
  constructor(
    private readonly ingredientRepository: IngredientRepository = getIngredientRepository(),
  ) {}

  public async listIngredients(search?: string): Promise<IngredientResponseDto[]> {
    const ingredients = search
      ? await this.ingredientRepository.findByQuery(search)
      : await this.ingredientRepository.findAll();

    return ingredients.map((ingredient) => this.mapToResponse(ingredient));
  }

  public async getIngredientById(id: number): Promise<IngredientResponseDto | null> {
    const ingredient = await this.ingredientRepository.findById(id);

    if (!ingredient) {
      return null;
    }

    return this.mapToResponse(ingredient);
  }

  public async createIngredient(data: Omit<IngredientEntity, 'id'>): Promise<IngredientResponseDto> {
    const created = await this.ingredientRepository.create(data);
    return this.mapToResponse(created);
  }

  public async updateIngredient(
    id: number,
    data: Partial<Omit<IngredientEntity, 'id'>>,
  ): Promise<IngredientResponseDto | null> {
    const updated = await this.ingredientRepository.update(id, data);

    if (!updated) {
      return null;
    }

    return this.mapToResponse(updated);
  }

  public async deleteIngredient(id: number): Promise<boolean> {
    return this.ingredientRepository.delete(id);
  }

  private mapToResponse(ingredient: IngredientEntity): IngredientResponseDto {
    return {
      id: ingredient.id,
      name: ingredient.name,
      description: ingredient.description,
      category: ingredient.category,
      unit: ingredient.unit,
      baseAmount: ingredient.baseAmount,
      calories: ingredient.calories,
      protein: ingredient.protein,
      carbs: ingredient.carbs,
      fat: ingredient.fat,
      tags: ingredient.tags,
      isHealthy: ingredient.isHealthy,
      isCommonInMexico: ingredient.isCommonInMexico,
    };
  }
}