import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('ingredient')
export class IngredientEntity {
  @PrimaryColumn({ type: 'varchar' })
  id!: string;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar' })
  description!: string;

  @Column({ type: 'varchar' })
  category!: string;

  @Column({ type: 'varchar' })
  unit!: string;

  @Column({ name: 'base_amount', type: 'varchar' })
  baseAmount!: string;

  @Column({ type: 'float' })
  calories!: number;

  @Column({ type: 'float' })
  protein!: number;

  @Column({ type: 'float' })
  carbs!: number;

  @Column({ type: 'float' })
  fat!: number;

  @Column({ type: 'simple-array' })
  tags!: string[];

  @Column({ name: 'is_healthy', type: 'boolean' })
  isHealthy!: boolean;

  @Column({ name: 'is_common_in_mexico', type: 'boolean' })
  isCommonInMexico!: boolean;
}
