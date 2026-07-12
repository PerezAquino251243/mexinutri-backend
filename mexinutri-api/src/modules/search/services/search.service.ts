import { getDishRepository } from '../../dishes/repositories/dish.repository';
import { getIngredientRepository } from '../../ingredients/repositories/ingredient.repository';
import { type SearchResponseDto } from '../dto/search.dto';

export class SearchService {
  constructor(
    private readonly ingredientRepository = getIngredientRepository(),
    private readonly dishRepository = getDishRepository(),
  ) {}

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
      })),
      ...dishes.map((dish) => ({
        type: 'dish' as const,
        id: dish.id,
        name: dish.name,
        description: dish.description,
        category: dish.category,
        tags: dish.tags,
      })),
    ];

    return {
      query,
      results,
    };
  }
}
