import { type Request, type Response, type NextFunction } from 'express';
import { SearchService } from '../services/search.service';

export class SearchController {
  constructor(private readonly searchService = new SearchService()) {}

  public search = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { q } = req.query;
      const query = typeof q === 'string' ? q : '';
      const result = await this.searchService.search(query);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}