export interface SearchResultItemDto {
  type: 'ingredient' | 'dish';
  id: number;
  name: string;
  description?: string;
  category?: string;
  tags?: string[];
  imageUrl?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  ingredients?: SearchIngredientDetailDto[];
}

export interface SearchIngredientDetailDto {
  ingredientId: number;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface SearchResponseDto {
  query: string;
  results: SearchResultItemDto[];
}
