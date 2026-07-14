export interface DishIngredientDto {
  ingredientId: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface DishResponseDto {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  ingredients: DishIngredientDto[];
  imageUrl?: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}
