import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { DishEntity } from './dish.typeorm.entity';

@Entity('dish_ingredient')
export class DishIngredientEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'ingredient_id', type: 'int' })
  ingredientId!: number;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'float' })
  quantity!: number;

  @Column({ type: 'varchar' })
  unit!: string;

  @ManyToOne(() => DishEntity, (dish) => dish.ingredients, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dish_id' })
  dish!: DishEntity;
}
