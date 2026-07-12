import { Type } from 'class-transformer';
import { IsString, IsNumber, IsArray, IsOptional, Min, MaxLength, ValidateNested, ArrayMinSize } from 'class-validator';

class DishIngredientInputDto {
  @IsString()
  ingredientId!: string;

  @IsNumber()
  @Min(1)
  quantity!: number;
}

export class UpdateDishDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => DishIngredientInputDto)
  ingredients?: DishIngredientInputDto[];
}