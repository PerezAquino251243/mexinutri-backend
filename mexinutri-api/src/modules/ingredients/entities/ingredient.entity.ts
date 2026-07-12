export interface IngredientEntity {
  id: string;
  name: string;
  description: string;
  category: string;
  unit: string;
  baseAmount: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  tags: string[];
  isHealthy: boolean;
  isCommonInMexico: boolean;
}
