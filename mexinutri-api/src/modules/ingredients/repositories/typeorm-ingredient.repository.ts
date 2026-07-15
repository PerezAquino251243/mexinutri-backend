import { type IngredientRepository } from './ingredient.repository';
import { IngredientEntity as IngredientEntityTypeOrm } from '../entities/typeorm/ingredient.typeorm.entity';
import { type IngredientEntity } from '../entities/ingredient.entity';
import { AppDataSource } from '../../../config/database';
import { type Repository } from 'typeorm';

export class TypeOrmIngredientRepository implements IngredientRepository {
  private get repo(): Repository<IngredientEntityTypeOrm> {
    return AppDataSource.getRepository(IngredientEntityTypeOrm);
  }

  public async findAll(): Promise<IngredientEntity[]> {
    const entities = await this.repo.find();
    return entities.map((e) => this.toDomain(e));
  }

  public async findById(id: number): Promise<IngredientEntity | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  public async findByQuery(query: string): Promise<IngredientEntity[]> {
    const normalizedQuery = `%${query.toLowerCase()}%`;
    const entities = await this.repo
      .createQueryBuilder('ingredient')
      .where('LOWER(ingredient.name) LIKE :q', { q: normalizedQuery })
      .orWhere('LOWER(ingredient.description) LIKE :q', { q: normalizedQuery })
      .orWhere('LOWER(ingredient.category) LIKE :q', { q: normalizedQuery })
      .orWhere('LOWER(ingredient.tags) LIKE :q', { q: normalizedQuery })
      .getMany();

    return entities.map((e) => this.toDomain(e));
  }

  public async create(data: Omit<IngredientEntity, 'id'>): Promise<IngredientEntity> {
    const entity = this.repo.create({
      name: data.name,
      description: data.description,
      category: data.category,
      unit: data.unit,
      baseAmount: data.baseAmount,
      calories: data.calories,
      protein: data.protein,
      carbs: data.carbs,
      fat: data.fat,
      tags: data.tags,
      isHealthy: data.isHealthy,
      isCommonInMexico: data.isCommonInMexico,
    });

    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }

  public async update(id: number, data: Partial<IngredientEntity>): Promise<IngredientEntity | null> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) return null;

    const updated = this.repo.merge(existing, data);
    const saved = await this.repo.save(updated);
    return this.toDomain(saved);
  }

  public async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }

  private toDomain(entity: IngredientEntityTypeOrm): IngredientEntity {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      category: entity.category,
      unit: entity.unit,
      baseAmount: entity.baseAmount,
      calories: entity.calories,
      protein: entity.protein,
      carbs: entity.carbs,
      fat: entity.fat,
      tags: entity.tags,
      isHealthy: entity.isHealthy,
      isCommonInMexico: entity.isCommonInMexico,
    };
  }
}