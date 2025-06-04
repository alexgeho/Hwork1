import express, { Express, Request, Response } from 'express';
import { videosRouter } from './videos/routers/videos.router';
import { testingRouter } from './testing/routers/testing.router';
import { setupSwagger } from './core/swagger/setup-swagger';

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.get('/', (req: Request, res: Response) => {
    res.status(200).send('Heyy Alex Bitau!!!');
  });

  app.use('/api/videos', videosRouter);
  app.use('/api/testing', testingRouter);

  setupSwagger(app);
  return app;
};
