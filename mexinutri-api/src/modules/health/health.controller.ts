import { type Request, type Response } from 'express';

export class HealthController {
  public getHealth(_req: Request, res: Response): void {
    res.status(200).json({
      status: 'ok',
      service: 'mexinutri-api',
      timestamp: new Date().toISOString(),
    });
  }
}
