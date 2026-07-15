import { type DishRepository } from './dish.repository';
import { DishEntity as DishEntityTypeOrm } from '../entities/typeorm/dish.typeorm.entity';
import { DishIngredientEntity as DishIngredientEntityTypeOrm } from '../entities/typeorm/dish-ingredient.typeorm.entity';
import { type DishEntity } from '../entities/dish.entity';
import { AppDataSource } from '../../../config/database';
import { type Repository } from 'typeorm';

export class TypeOrmDishRepository implements DishRepository {
  private get repo(): Repository<DishEntityTypeOrm> {
    return AppDataSource.getRepository(DishEntityTypeOrm);
  }

  public async findAll(): Promise<DishEntity[]> {
    const entities = await this.repo.find({ relations: ['ingredients'] });
    return entities.map((e) => this.toDomain(e));
  }

  public async findById(id: number): Promise<DishEntity | null> {
    const entity = await this.repo.findOne({ where: { id }, relations: ['ingredients'] });
    return entity ? this.toDomain(entity) : null;
  }

  public async findByQuery(query: string): Promise<DishEntity[]> {
    const normalizedQuery = `%${query.toLowerCase()}%`;
    const entities = await this.repo
      .createQueryBuilder('dish')
      .leftJoinAndSelect('dish.ingredients', 'ingredients')
      .where('LOWER(dish.name) LIKE :q', { q: normalizedQuery })
      .orWhere('LOWER(dish.description) LIKE :q', { q: normalizedQuery })
      .orWhere('LOWER(dish.category) LIKE :q', { q: normalizedQuery })
      .orWhere('LOWER(dish.tags) LIKE :q', { q: normalizedQuery })
      .orWhere('LOWER(ingredients.name) LIKE :q', { q: normalizedQuery })
      .getMany();

    return entities.map((e) => this.toDomain(e));
  }

  public async create(data: Omit<DishEntity, 'id'>): Promise<DishEntity> {
    const entity = this.repo.create({
      name: data.name,
      description: data.description,
      category: data.category,
      tags: data.tags,
      imageUrl: data.imageUrl,
      ingredients: data.ingredients.map((ing) => ({
        ingredientId: ing.ingredientId,
        name: ing.name,
        quantity: ing.quantity,
        unit: ing.unit,
      })),
    });

    const saved = await this.repo.save(entity);
    const reloaded = await this.repo.findOne({ where: { id: saved.id }, relations: ['ingredients'] });
    return this.toDomain(reloaded!);
  }

  public async update(id: number, data: Partial<DishEntity>): Promise<DishEntity | null> {
    const existing = await this.repo.findOne({ where: { id }, relations: ['ingredients'] });
    if (!existing) return null;

    if (data.name !== undefined) existing.name = data.name;
    if (data.description !== undefined) existing.description = data.description;
    if (data.category !== undefined) existing.category = data.category;
    if (data.tags !== undefined) existing.tags = data.tags;
    if (data.imageUrl !== undefined) existing.imageUrl = data.imageUrl;

    if (data.ingredients !== undefined) {
      const ingRepo = AppDataSource.getRepository(DishIngredientEntityTypeOrm);
      await ingRepo.delete({ dish: { id } });
      for (const ing of data.ingredients) {
        const newIng = ingRepo.create({
          ingredientId: ing.ingredientId,
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit,
          dish: existing,
        });
        await ingRepo.save(newIng);
      }
    }

    const saved = await this.repo.save(existing);
    const reloaded = await this.repo.findOne({ where: { id: saved.id }, relations: ['ingredients'] });
    return this.toDomain(reloaded!);
  }

  public async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }

  private toDomain(entity: DishEntityTypeOrm): DishEntity {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      category: entity.category,
      tags: entity.tags,
      imageUrl: entity.imageUrl,
      ingredients: entity.ingredients.map((ing) => ({
        ingredientId: ing.ingredientId,
        name: ing.name,
        quantity: ing.quantity,
        unit: ing.unit,
      })),
    };
  }
}