import { Type } from 'class-transformer';
import { IsString, IsNumber, IsBoolean, IsArray, IsNotEmpty, Min, MaxLength, ValidateNested, ArrayMinSize } from 'class-validator';

class DishIngredientInputDto {
  @IsString()
  @IsNotEmpty()
  ingredientId!: string;

  @IsNumber()
  @Min(1)
  quantity!: number;
}

export class CreateDishDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  category!: string;

  @IsArray()
  @IsString({ each: true })
  tags!: string[];

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => DishIngredientInputDto)
  ingredients!: DishIngredientInputDto[];
}