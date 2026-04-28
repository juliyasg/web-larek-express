import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';

export const getProducts = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const items = await Product.find({});

    return res.send({
      items,
      total: items.length,
    });
  } catch (error) {
    return next(error);
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const product = await Product.create(req.body);

    return res.status(201).send(product);
  } catch (error: unknown) {
    if (error instanceof MongooseError.ValidationError) {
      return next(
        new BadRequestError(
          'Ошибка валидации данных при создании товара',
        ),
      );
    }

    if (
      error instanceof Error
      && error.message.includes('E11000')
    ) {
      return next(
        new ConflictError(
          'Товар с таким title уже существует',
        ),
      );
    }

    return next(error);
  }
};
