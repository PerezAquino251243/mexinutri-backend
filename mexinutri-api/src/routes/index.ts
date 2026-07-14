import { Router } from 'express';
import { HealthController } from '../modules/health/health.controller';
import { IngredientController } from '../modules/ingredients';
import { DishController } from '../modules/dishes';
import { SearchController } from '../modules/search';
import { NutritionController } from '../modules/nutrition/controllers/nutrition.controller';
import { MealPlanController } from '../modules/meal-plans/controllers/meal-plan.controller';
import { UploadController } from '../modules/uploads/upload.controller';

const router = Router();
const healthController = new HealthController();
const ingredientController = new IngredientController();
const dishController = new DishController();
const searchController = new SearchController();
const nutritionController = new NutritionController();
const mealPlanController = new MealPlanController();
const uploadController = new UploadController();

router.get('/health', healthController.getHealth.bind(healthController));
router.get('/ingredients', ingredientController.getIngredients);
router.post('/ingredients', ingredientController.createIngredient);
router.get('/ingredients/:id', ingredientController.getIngredientById);
router.put('/ingredients/:id', ingredientController.updateIngredient);
router.delete('/ingredients/:id', ingredientController.deleteIngredient);
router.get('/dishes', dishController.getDishes);
router.post('/dishes', dishController.createDish);
router.get('/dishes/:id', dishController.getDishById);
router.put('/dishes/:id', dishController.updateDish);
router.delete('/dishes/:id', dishController.deleteDish);
router.get('/search', searchController.search);
router.post('/nutrition/calculate', nutritionController.calculate);
router.post('/meal-plans/generate', mealPlanController.generate);
router.post('/dishes/:id/image', uploadController.uploadMiddleware, uploadController.uploadDishImage);

export default router;
