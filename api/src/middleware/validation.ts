/**
 * Node modules
 */
import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodType } from 'zod';

interface validationSchema {
  body?: ZodType<any>;
  query?: ZodType<any>;
  params?: ZodType<any>;
  cookies?: ZodType<any>;
}

export class ValidationError extends Error {
  statusCode: number;
  issues: any[];

  constructor(message: string, issues: any[]) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.issues = issues;
  }
}

const formatZodError = (error: ZodError) => {
  return error.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
    code: issue.code,
  }));
};

export const validate = (schema: validationSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        req.body = await schema.body.parseAsync(req.body);
      }

      if (schema.query) {
        const validatedQuery = await schema.query.parseAsync(req.query);
        Object.keys(req.query).forEach((key) => delete req.query[key]);
        Object.assign(req.query, validatedQuery);
      }

      if (schema.params) {
        req.params = await schema.params.parseAsync(req.params);
      }

      if (schema.cookies) {
        req.cookies = await schema.cookies?.parseAsync(req.cookies);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = formatZodError(error);

        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: formattedErrors,
        });
        return;
      }

      next(error);
    }
  };
};

export const validateBody = (schema: ZodType<any>) => {
  return validate({ body: schema });
};

export const validateQuery = (schema: ZodType<any>) => {
  return validate({ query: schema });
};

export const validateParams = (schema: ZodType<any>) => {
  return validate({ params: schema });
};

export const validateCookies = (schema: ZodType<any>) => {
  return validate({ cookies: schema });
};
