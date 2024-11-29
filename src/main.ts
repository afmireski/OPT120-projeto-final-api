import express from 'express';
import cors from 'cors';
import { router } from './routes/router';
import { ConfigService } from './config/config.service';
import { KnexService } from './services/knex.service';

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
  KnexService.create({
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  });


  const port = configService.get('PORT') || 3000;

  app.listen(port, () => {
    console.log(`Server started at port ${port}`);
  });
}

main();
