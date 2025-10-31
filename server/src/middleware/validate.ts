import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ValidationError } from '../utils/AppError';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.errors.reduce((acc: any, curr) => {
          const path = curr.path.join('.');
          acc[path] = curr.message;
          return acc;
        }, {});
        next(new ValidationError(details));
      } else {
        next(error);
      }
    }
  };
};