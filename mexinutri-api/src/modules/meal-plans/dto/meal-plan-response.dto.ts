export interface MealPlanItemDto {
  type: 'dish' | 'ingredients';
  name?: string;
  dishId?: string;
  ingredients?: {
    ingredientId: string;
    name: string;
    quantity: number;
    unit: string;
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