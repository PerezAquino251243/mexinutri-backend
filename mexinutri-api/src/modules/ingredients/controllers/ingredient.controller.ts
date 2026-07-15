import { type Request, type Response, type NextFunction } from 'express';
import { IngredientService } from '../services/ingredient.service';
import { CreateIngredientDto } from '../dto/create-ingredient.dto';
import { UpdateIngredientDto } from '../dto/update-ingredient.dto';
import { validateDto } from '../../../common/validation';
import { AppError } from '../../../common/error-handler';

export class IngredientController {
  constructor(private readonly ingredientService: IngredientService = new IngredientService()) {}

  public getIngredients = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const search = typeof req.query.q === 'string' ? req.query.q : undefined;
      const ingredients = await this.ingredientService.listIngredients(search);
      res.status(200).json({ success: true, data: ingredients });
    } catch (err) {
      next(err);
    }
  };

  public getIngredientById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ingredientId = Number(req.params.id);
      if (isNaN(ingredientId)) {
        throw new AppError('Invalid ingredient ID', 400);
      }
      const ingredient = await this.ingredientService.getIngredientById(ingredientId);

      if (!ingredient) {
        throw new AppError('Ingredient not found', 404);
      }

      res.status(200).json({ success: true, data: ingredient });
    } catch (err) {
      next(err);
    }
  };

  public createIngredient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validation = await validateDto(CreateIngredientDto, req.body as Record<string, unknown>);
      if (!validation.valid) {
        throw new AppError('Validation failed', 400);
      }

      const created = await this.ingredientService.createIngredient(req.body as any);
      res.status(201).json({ success: true, data: created });
    } catch (err) {
      next(err);
    }
  };

  public updateIngredient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ingredientId = Number(req.params.id);
      if (isNaN(ingredientId)) {
        throw new AppError('Invalid ingredient ID', 400);
      }
      const validation = await validateDto(UpdateIngredientDto, req.body as Record<string, unknown>);
      if (!validation.valid) {
        throw new AppError('Validation failed', 400);
      }

      const updated = await this.ingredientService.updateIngredient(ingredientId, req.body as any);
      if (!updated) {
        throw new AppError('Ingredient not found', 404);
      }

      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  };

  public deleteIngredient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ingredientId = Number(req.params.id);
      if (isNaN(ingredientId)) {
        throw new AppError('Invalid ingredient ID', 400);
      }
      const deleted = await this.ingredientService.deleteIngredient(ingredientId);

      if (!deleted) {
        throw new AppError('Ingredient not found', 404);
      }

      res.status(200).json({ success: true, message: 'Ingredient deleted' });
    } catch (err) {
      next(err);
    }
  };
}