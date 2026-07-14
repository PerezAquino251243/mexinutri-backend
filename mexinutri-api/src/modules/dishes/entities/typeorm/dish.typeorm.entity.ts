import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { DishIngredientEntity } from './dish-ingredient.typeorm.entity';

@Entity('dish')
export class DishEntity {
  @PrimaryColumn({ type: 'varchar' })
  id!: string;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar' })
  description!: string;

  @Column({ type: 'varchar' })
  category!: string;

  @Column({ type: 'simple-array' })
  tags!: string[];

  @Column({ name: 'image_url', type: 'varchar', nullable: true })
  imageUrl?: string;

  @OneToMany(() => DishIngredientEntity, (dishIngredient) => dishIngredient.dish, {
    cascade: true,
    eager: true,
  })
  ingredients!: DishIngredientEntity[];
}
