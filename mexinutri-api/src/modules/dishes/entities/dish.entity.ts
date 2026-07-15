export interface DishIngredientEntity {
  ingredientId: number;
  name: string;
  quantity: number;
  unit: string;
}

export interface DishEntity {
  id: number;
  name: string;
  description: string;
  category: string;
  tags: string[];
  ingredients: DishIngredientEntity[];
  imageUrl?: string;
}
