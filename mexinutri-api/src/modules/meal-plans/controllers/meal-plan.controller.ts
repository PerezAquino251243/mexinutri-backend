import { type Request, type Response, type NextFunction } from 'express';
import { MealPlanService } from '../services/meal-plan.service';
import { GenerateMealPlanDto } from '../dto/generate-plan.dto';
import { validateDto } from '../../../common/validation';
import { AppError } from '../../../common/error-handler';

export class MealPlanController {
  constructor(private readonly mealPlanService: MealPlanService = new MealPlanService()) {}

  public generate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validation = await validateDto(GenerateMealPlanDto, req.body as Record<string, unknown>);
      if (!validation.valid) {
        throw new AppError('Validation failed', 400);
      }

      const { targetCalories, numberOfMeals } = req.body;
      const plan = await this.mealPlanService.generate(targetCalories, numberOfMeals);
      res.status(200).json({ success: true, data: plan });
    } catch (err) {
      next(err);
    }
  };
}