import { IsString, IsNumber, IsBoolean, IsArray, IsNotEmpty, Min, MaxLength } from 'class-validator';

export class CreateIngredientDto {
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

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  unit!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  baseAmount!: string;

  @IsNumber()
  @Min(0)
  calories!: number;

  @IsNumber()
  @Min(0)
  protein!: number;

  @IsNumber()
  @Min(0)
  carbs!: number;

  @IsNumber()
  @Min(0)
  fat!: number;

  @IsArray()
  @IsString({ each: true })
  tags!: string[];

  @IsBoolean()
  isHealthy!: boolean;

  @IsBoolean()
  isCommonInMexico!: boolean;
}