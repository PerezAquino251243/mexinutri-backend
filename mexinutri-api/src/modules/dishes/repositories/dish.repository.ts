import { type DishEntity } from '../entities/dish.entity';
import { TypeOrmDishRepository } from './typeorm-dish.repository';
import { AppDataSource } from '../../../config/database';

export interface DishRepository {
  findAll(): Promise<DishEntity[]>;
  findById(id: number): Promise<DishEntity | null>;
  findByQuery(query: string): Promise<DishEntity[]>;
  create(dish: Omit<DishEntity, 'id'>): Promise<DishEntity>;
  update(id: number, data: Partial<DishEntity>): Promise<DishEntity | null>;
  delete(id: number): Promise<boolean>;
}

const seedDishes: DishEntity[] = [
  {
    id: 1,
    name: 'Huevos rancheros',
    description: 'Platillo tradicional con huevo, tortilla y salsa.',
    category: 'Desayuno',
    tags: ['huevo', 'tortilla', 'desayuno', 'mexicano'],
    ingredients: [
      { ingredientId: 1, name: 'Huevo', quantity: 2, unit: 'pieza' },
      { ingredientId: 7, name: 'Tomate', quantity: 100, unit: 'g' },
      { ingredientId: 5, name: 'Tortilla de maíz', quantity: 2, unit: 'pieza' },
      { ingredientId: 8, name: 'Cebolla', quantity: 20, unit: 'g' },
    ],
  },
  {
    id: 2,
    name: 'Ensalada de espinaca',
    description: 'Ensalada ligera con espinaca y aguacate.',
    category: 'Ensalada',
    tags: ['espinaca', 'ensalada', 'saludable'],
    ingredients: [
      { ingredientId: 2, name: 'Espinaca', quantity: 100, unit: 'g' },
      { ingredientId: 6, name: 'Aguacate', quantity: 1, unit: 'pieza' },
      { ingredientId: 7, name: 'Tomate', quantity: 100, unit: 'g' },
    ],
  },
  {
    id: 3,
    name: 'Tacos de pollo saludables',
    description: 'Tacos con pechuga de pollo y vegetales.',
    category: 'Comida',
    tags: ['pollo', 'taco', 'saludable'],
    ingredients: [
      { ingredientId: 3, name: 'Pechuga de pollo', quantity: 150, unit: 'g' },
      { ingredientId: 5, name: 'Tortilla de maíz', quantity: 2, unit: 'pieza' },
      { ingredientId: 6, name: 'Aguacate', quantity: 1, unit: 'pieza' },
    ],
  },
];

let sharedInstance: DishRepository | null = null;

export function getDishRepository(): DishRepository {
  if (!sharedInstance) {
    if (AppDataSource.isInitialized) {
      sharedInstance = new TypeOrmDishRepository();
    } else {
      sharedInstance = new InMemoryDishRepository();
    }
  }
  return sharedInstance;
}

export class InMemoryDishRepository implements DishRepository {
  private readonly dishes: DishEntity[] = [...seedDishes];
  private nextId: number = 4;

  public async findAll(): Promise<DishEntity[]> {
    return [...this.dishes];
  }

  public async findById(id: number): Promise<DishEntity | null> {
    return this.dishes.find((dish) => dish.id === id) ?? null;
  }

  public async findByQuery(query: string): Promise<DishEntity[]> {
    const normalizedQuery = query.toLowerCase();

    return this.dishes.filter((dish) => {
      const ingredientNames = dish.ingredients.map((ingredient) => ingredient.name).join(' ').toLowerCase();
      const haystack = [dish.name, dish.description, dish.category, dish.tags.join(' '), ingredientNames]
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }

  public async create(data: Omit<DishEntity, 'id'>): Promise<DishEntity> {
    const dish: DishEntity = { id: this.nextId++, ...data };
    this.dishes.push(dish);
    return dish;
  }

  public async update(id: number, data: Partial<DishEntity>): Promise<DishEntity | null> {
    const index = this.dishes.findIndex((dish) => dish.id === id);
    if (index === -1) {
      return null;
    }

    const updated = { ...this.dishes[index]!, ...data, id };
    this.dishes[index] = updated;
    return updated;
  }

  public async delete(id: number): Promise<boolean> {
    const index = this.dishes.findIndex((dish) => dish.id === id);
    if (index === -1) {
      return false;
    }

    this.dishes.splice(index, 1);
    return true;
  }
}