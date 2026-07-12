import { type Request, type Response, type NextFunction } from 'express';
import { NutritionService } from '../services/nutrition.service';
import { CalculateNutritionDto } from '../dto/calculate-nutrition.dto';
import { validateDto } from '../../../common/validation';
import { AppError } from '../../../common/error-handler';

export class NutritionController {
  constructor(private readonly nutritionService: NutritionService = new NutritionService()) {}

  public calculate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validation = await validateDto(CalculateNutritionDto, req.body as Record<string, unknown>);
      if (!validation.valid) {
        throw new AppError('Validation failed', 400);
      }

      const result = await this.nutritionService.calculate(req.body.items);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };
}