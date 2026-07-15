import { type Request, type Response, type NextFunction } from 'express';
import multer, { type FileFilterCallback } from 'multer';
import { UploadService } from './upload.service';
import { getDishRepository } from '../dishes/repositories/dish.repository';
import { AppError } from '../../common/error-handler';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WebP and GIF are allowed.'));
    }
  },
});

export class UploadController {
  private readonly uploadService = new UploadService();
  private readonly dishRepository = getDishRepository();

  public uploadMiddleware = upload.single('image');

  public uploadDishImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dishId = Number(req.params.id);
      if (isNaN(dishId)) {
        throw new AppError('Invalid dish ID', 400);
      }

      // Verify dish exists
      const dish = await this.dishRepository.findById(dishId);
      if (!dish) {
        throw new AppError('Dish not found', 404);
      }

      const file = req.file;
      if (!file) {
        throw new AppError('No image file provided', 400);
      }

      const imageUrl = await this.uploadService.uploadDishImage(
        String(dishId),
        file.buffer,
        file.mimetype,
      );

      // Save imageUrl to dish
      await this.dishRepository.update(dishId, { imageUrl });

      res.status(200).json({
        success: true,
        data: { imageUrl },
      });
    } catch (err) {
      next(err);
    }
  };
}