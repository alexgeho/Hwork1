import express, { Express } from 'express';
import { setupApp } from './setup-app';

const app: Express = express();
setupApp(app);

if (require.main === module) {
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
}

export default app;
