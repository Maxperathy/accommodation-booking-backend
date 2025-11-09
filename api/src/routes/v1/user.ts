/**
 * Node modules
 */
import { Router } from 'express';

/**
 * Middleware
 */
import authenticate from '@/middleware/authenticate';

/**
 * Controllers
 */
import getCurentUser from '@/controllers/v1/user/get_user';

const router = Router();

router.get('/profile', authenticate, getCurentUser);

export default router;
