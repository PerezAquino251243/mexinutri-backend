export interface NutritionResponseDto {
  items: {
    ingredientId: string;
    name: string;
    quantity: number;
    unit: string;
    nutrition: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
  }[];
  total: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}