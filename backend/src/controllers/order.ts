import { Request, Response, NextFunction } from 'express';
import { faker } from '@faker-js/faker';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';

const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { items, total } = req.body;

    const products = await Product.find({
      _id: { $in: items },
    });

    if (products.length !== items.length) {
      return next(
        new BadRequestError(
          'Один или несколько товаров не найдены',
        ),
      );
    }

    const unavailable = products.find(
      (item) => item.price === null,
    );

    if (unavailable) {
      return next(
        new BadRequestError(
          `Товар ${unavailable.title} не продается`,
        ),
      );
    }

    const sum = products.reduce(
      (acc, item) => acc + (item.price || 0),
      0,
    );

    if (sum !== total) {
      return next(
        new BadRequestError('Неверная сумма заказа'),
      );
    }

    return res.send({
      id: faker.string.uuid(),
      total,
    });
  } catch (error) {
    return next(error);
  }
};

export default createOrder;
