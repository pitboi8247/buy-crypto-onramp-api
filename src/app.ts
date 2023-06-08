import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { APIError } from './utils/APIError';
import { config as _c } from 'dotenv';
import httpLogger from './utils/httpLogger';
//need to put in config

const app = express();

app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(httpLogger.successHandler);
app.use(httpLogger.errorHandler);
app.use((err: APIError, req: Request, res: Response, next: NextFunction) => {
  err.status = err.status || 500;
  if (!(err instanceof APIError)) {
    err = new APIError((err as any).message, null, (err as any).status);
  }
  res.status(err.status).send(err.toJson());
});


export default app