import { type IngredientEntity } from '../entities/ingredient.entity';
import { TypeOrmIngredientRepository } from './typeorm-ingredient.repository';
import { AppDataSource } from '../../../config/database';

export interface IngredientRepository {
  findAll(): Promise<IngredientEntity[]>;
  findById(id: number): Promise<IngredientEntity | null>;
  findByQuery(query: string): Promise<IngredientEntity[]>;
  create(ingredient: Omit<IngredientEntity, 'id'>): Promise<IngredientEntity>;
  update(id: number, data: Partial<IngredientEntity>): Promise<IngredientEntity | null>;
  delete(id: number): Promise<boolean>;
}

const seedIngredients: IngredientEntity[] = [
  {
    id: 1,
    name: 'Huevo',
    description: 'Alimento base rico en proteína.',
    category: 'Proteína',
    unit: 'pieza',
    baseAmount: '1 pieza',
    calories: 72,
    protein: 6.3,
    carbs: 0.4,
    fat: 5,
    tags: ['huevo', 'proteína', 'desayuno'],
    isHealthy: true,
    isCommonInMexico: true,
  },
  {
    id: 2,
    name: 'Espinaca',
    description: 'Hoja verde muy utilizada en ensaladas y platillos.',
    category: 'Vegetal',
    unit: 'g',
    baseAmount: '100 g',
    calories: 23,
    protein: 2.9,
    carbs: 3.6,
    fat: 0.4,
    tags: ['espinaca', 'verde', 'ensalada'],
    isHealthy: true,
    isCommonInMexico: true,
  },
  {
    id: 3,
    name: 'Pechuga de pollo',
    description: 'Proteína magra muy popular en cocina casera.',
    category: 'Proteína',
    unit: 'g',
    baseAmount: '100 g',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    tags: ['pollo', 'proteína', 'saludable'],
    isHealthy: true,
    isCommonInMexico: true,
  },
  {
    id: 4,
    name: 'Arroz',
    description: 'Cereal base para múltiples platillos.',
    category: 'Grano',
    unit: 'g',
    baseAmount: '100 g',
    calories: 130,
    protein: 2.7,
    carbs: 28,
    fat: 0.3,
    tags: ['arroz', 'grano', 'carbohidrato'],
    isHealthy: false,
    isCommonInMexico: true,
  },
  {
    id: 5,
    name: 'Tortilla de maíz',
    description: 'Base tradicional para tacos y otros platillos.',
    category: 'Grano',
    unit: 'pieza',
    baseAmount: '1 pieza',
    calories: 52,
    protein: 1.4,
    carbs: 11,
    fat: 1.4,
    tags: ['tortilla', 'maíz', 'taco'],
    isHealthy: true,
    isCommonInMexico: true,
  },
  {
    id: 6,
    name: 'Aguacate',
    description: 'Fruta con grasas saludables y textura cremosa.',
    category: 'Fruta',
    unit: 'pieza',
    baseAmount: '1 pieza',
    calories: 160,
    protein: 2,
    carbs: 9,
    fat: 15,
    tags: ['aguacate', 'grasa saludable', 'mexicano'],
    isHealthy: true,
    isCommonInMexico: true,
  },
  {
    id: 7,
    name: 'Tomate',
    description: 'Vegetal base para salsas y platillos calientes.',
    category: 'Vegetal',
    unit: 'g',
    baseAmount: '100 g',
    calories: 18,
    protein: 0.9,
    carbs: 3.9,
    fat: 0.2,
    tags: ['tomate', 'vegetal', 'salsa'],
    isHealthy: true,
    isCommonInMexico: true,
  },
  {
    id: 8,
    name: 'Cebolla',
    description: 'Ingrediente aromático de uso muy común.',
    category: 'Vegetal',
    unit: 'g',
    baseAmount: '100 g',
    calories: 40,
    protein: 1.1,
    carbs: 9.3,
    fat: 0.1,
    tags: ['cebolla', 'vegetal', 'aromático'],
    isHealthy: true,
    isCommonInMexico: true,
  },
  {
    id: 9,
    name: 'Frijol',
    description: 'Legumbre nutritiva y muy presente en la dieta mexicana.',
    category: 'Legumbre',
    unit: 'g',
    baseAmount: '100 g',
    calories: 132,
    protein: 8.9,
    carbs: 23.7,
    fat: 0.5,
    tags: ['frijol', 'legumbre', 'proteína vegetal'],
    isHealthy: true,
    isCommonInMexico: true,
  },
];

let sharedInstance: IngredientRepository | null = null;

export function getIngredientRepository(): IngredientRepository {
  if (!sharedInstance) {
    if (AppDataSource.isInitialized) {
      sharedInstance = new TypeOrmIngredientRepository();
    } else {
      sharedInstance = new InMemoryIngredientRepository();
    }
  }
  return sharedInstance;
}

export function resetIngredientRepository(): void {
  sharedInstance = null;
}

export class InMemoryIngredientRepository implements IngredientRepository {
  private readonly ingredients: IngredientEntity[] = [...seedIngredients];
  private nextId: number = 10;

  public async findAll(): Promise<IngredientEntity[]> {
    return [...this.ingredients];
  }

  public async findById(id: number): Promise<IngredientEntity | null> {
    return this.ingredients.find((ingredient) => ingredient.id === id) ?? null;
  }

  public async findByQuery(query: string): Promise<IngredientEntity[]> {
    const normalizedQuery = query.toLowerCase();

    return this.ingredients.filter((ingredient) => {
      const haystack = [
        ingredient.name,
        ingredient.description,
        ingredient.category,
        ingredient.tags.join(' '),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }

  public async create(data: Omit<IngredientEntity, 'id'>): Promise<IngredientEntity> {
    const ingredient: IngredientEntity = {
      id: this.nextId++,
      ...data,
    };
    this.ingredients.push(ingredient);
    return ingredient;
  }

  public async update(id: number, data: Partial<IngredientEntity>): Promise<IngredientEntity | null> {
    const index = this.ingredients.findIndex((ingredient) => ingredient.id === id);
    if (index === -1) {
      return null;
    }

    const updated = { ...this.ingredients[index]!, ...data, id };
    this.ingredients[index] = updated;
    return updated;
  }

  public async delete(id: number): Promise<boolean> {
    const index = this.ingredients.findIndex((ingredient) => ingredient.id === id);
    if (index === -1) {
      return false;
    }

    this.ingredients.splice(index, 1);
    return true;
  }
}