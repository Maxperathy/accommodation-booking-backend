/**
 * Node modules
 */
import { Router } from 'express';

/**
 * Controllers
 */
import register from '@/controllers/v1/auth/register';
import login from '@/controllers/v1/auth/login';
import refreshToken from '@/controllers/v1/auth/refresh-token';
import logout from '@/controllers/v1/auth/logout';

/**
 * Middlewares
 */
import { validateBody, validateCookies } from '@/middleware/validation';
import {
  registerSchema,
  loginSchema,
  refreshTokenCookieSchema,
} from '@/schemas/userSchema';
import authenticate from '@/middleware/authenticate';

const router = Router();

router.post('/register', validateBody(registerSchema), register);

router.post('/login', validateBody(loginSchema), login);

router.post(
  '/refresh-token',
  validateCookies(refreshTokenCookieSchema),
  refreshToken,
);

router.post('/logout', authenticate, logout);

export default router;
