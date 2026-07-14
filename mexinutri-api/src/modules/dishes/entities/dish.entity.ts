export interface DishIngredientEntity {
  ingredientId: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface DishEntity {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  ingredients: DishIngredientEntity[];
  imageUrl?: string;
}
