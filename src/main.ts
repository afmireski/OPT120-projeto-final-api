import express from 'express';
import cors from 'cors';
import { router } from './routes/router';
import { ConfigService } from './config/config.service';

async function main() {
  const app = express();

  const corsOptions = {
    methods: 'GET, POST, PATCH, PUT, DELETE',
    allowedHeaders: 'Content-Type, Accept',
    exposedHeaders: 'Content-Type, Accept',
    maxAge: 3600,
    credentials: true,
  };

  app.use(cors(corsOptions));
  app.use(express.json());
  app.use('/', router);

  const configService = ConfigService.create();

  const port = configService.get('PORT') || 3000;

  app.listen(port, () => {
    console.log(`Server started at port ${port}`);
  });
}

main();
