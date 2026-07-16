import { Type } from 'class-transformer';
import { IsString, IsNumber, IsArray, IsNotEmpty, Min, ValidateNested, ArrayMinSize } from 'class-validator';

class NutritionItemDto {
  @IsNumber()
  @Min(1)
  ingredientId!: number;

  @IsNumber()
  @Min(0.01)
  quantity!: number;
}

export class CalculateNutritionDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => NutritionItemDto)
  items!: NutritionItemDto[];
}