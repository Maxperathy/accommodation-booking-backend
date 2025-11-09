/**
 * Custom modules
 */
import { logger } from '@/lib/winston';
import config from '@/config/index';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { registerSchemaType } from '@/schemas/userSchema';

/**
 * Models
 */
import { User } from '@/models/user';
import Token from '@/models/token';

/**
 * Types
 */
import type { Request, Response } from 'express';

const register = async (req: Request, res: Response): Promise<void> => {
  const { fullname, email, password } = req.body as registerSchemaType;

  try {
    const newUser = await User.create({
      fullname,
      email,
      password,
    });

    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    await Token.create({
      token: refreshToken,
      userId: newUser._id,
    });
    logger.info('Refresh token created for user', {
      token: refreshToken,
      userId: newUser._id,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(201).json({
      user: {
        fullname: newUser.fullname,
        email: newUser.email,
      },
      accessToken,
    });
    logger.info('User registered successfully', {
      newUser,
    });
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
      error: err,
    });
    logger.error('Error during user registration', err);
  }
};

export default register;
