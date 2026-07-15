import { type Request, type Response, type NextFunction } from 'express';
import { DishService } from '../services/dish.service';
import { CreateDishDto } from '../dto/create-dish.dto';
import { UpdateDishDto } from '../dto/update-dish.dto';
import { validateDto } from '../../../common/validation';
import { AppError } from '../../../common/error-handler';

export class DishController {
  constructor(private readonly dishService: DishService = new DishService()) {}

  public getDishes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const search = typeof req.query.q === 'string' ? req.query.q : undefined;
      const dishes = await this.dishService.listDishes(search);
      res.status(200).json({ success: true, data: dishes });
    } catch (err) {
      next(err);
    }
  };

  public getDishById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dishId = Number(req.params.id);
      if (isNaN(dishId)) {
        throw new AppError('Invalid dish ID', 400);
      }
      const dish = await this.dishService.getDishById(dishId);

      if (!dish) {
        throw new AppError('Dish not found', 404);
      }

      res.status(200).json({ success: true, data: dish });
    } catch (err) {
      next(err);
    }
  };

  public createDish = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validation = await validateDto(CreateDishDto, req.body as Record<string, unknown>);
      if (!validation.valid) {
        throw new AppError('Validation failed', 400);
      }

      const created = await this.dishService.createDish(req.body as any);
      res.status(201).json({ success: true, data: created });
    } catch (err) {
      next(err);
    }
  };

  public updateDish = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dishId = Number(req.params.id);
      if (isNaN(dishId)) {
        throw new AppError('Invalid dish ID', 400);
      }
      const validation = await validateDto(UpdateDishDto, req.body as Record<string, unknown>);
      if (!validation.valid) {
        throw new AppError('Validation failed', 400);
      }

      const updated = await this.dishService.updateDish(dishId, req.body as any);
      if (!updated) {
        throw new AppError('Dish not found', 404);
      }

      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  };

  public deleteDish = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dishId = Number(req.params.id);
      if (isNaN(dishId)) {
        throw new AppError('Invalid dish ID', 400);
      }
      const deleted = await this.dishService.deleteDish(dishId);

      if (!deleted) {
        throw new AppError('Dish not found', 404);
      }

      res.status(200).json({ success: true, message: 'Dish deleted' });
    } catch (err) {
      next(err);
    }
  };
}