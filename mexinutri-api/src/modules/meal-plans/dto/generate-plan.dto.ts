import { IsNumber, IsOptional, Min, Max } from 'class-validator';

export class GenerateMealPlanDto {
  @IsNumber()
  @Min(500)
  @Max(10000)
  targetCalories!: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(6)
  numberOfMeals?: number;
}