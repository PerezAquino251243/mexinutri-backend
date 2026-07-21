export interface MealPlanItemDto {
  type: 'dish' | 'ingredients';
  name?: string;
  dishId?: number;
  imageUrl?: string;
  ingredients?: {
    ingredientId: number;
    name: string;
    quantity: number;
    unit: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface MealPlanResponseDto {
  targetCalories: number;
  meals: MealPlanItemDto[];
  total: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}