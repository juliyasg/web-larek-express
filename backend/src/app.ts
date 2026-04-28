import path from 'path';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { errors } from 'celebrate';

import {
  requestLogger,
  errorLogger,
} from './middlewares/logger';

import productRoutes from './routes/product';

import orderRoutes from './routes/order';

import errorHandler from './middlewares/error-handler';
import NotFoundError from './errors/not-found-error';

dotenv.config();

const app = express();

const {
  PORT = 3000,
  DB_ADDRESS = 'mongodb://127.0.0.1:27017/weblarek',
  ORIGIN_ALLOW = 'http://localhost:5173',
} = process.env;

app.use(cors({
  origin: ORIGIN_ALLOW,
}));

app.use(express.json());

app.use(requestLogger);

app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use(productRoutes);
app.use(orderRoutes);

app.use('*', (_req, _res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});

app.use(errors());

app.use(errorLogger);

app.use(errorHandler);

mongoose.connect(DB_ADDRESS)
  .then(() => {
    console.log('MongoDB connected');

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
