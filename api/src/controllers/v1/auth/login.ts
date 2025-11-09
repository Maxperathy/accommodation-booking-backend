/**
 * Custom modules
 */
import { logger } from '@/lib/winston';
import config from '@/config/index';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { loginSchemaType } from '@/schemas/userSchema';

/**
 * Models
 */
import { User } from '@/models/user';
import Token from '@/models/token';

/**
 * Types
 */
import type { Request, Response } from 'express';

const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as loginSchemaType;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(404).json({
        code: 'NotFound',
        message: 'User not found',
      });
      return;
    }

    const isPasswordCorrect = await user.isPasswordValid(password);
    if (!isPasswordCorrect) {
      res.status(401).json({
        code: 'NotFound',
        message: 'Invalid email or password',
      });
      return;
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    await Token.create({
      token: refreshToken,
      userId: user._id,
    });
    logger.info('Refresh token created for user', {
      token: refreshToken,
      userId: user._id,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(201).json({
      user: {
        fullname: user.fullname,
        email: user.email,
      },
      accessToken,
    });
    logger.info('User login successfully', {
      user,
    });
    console.log('User created', { user });
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
      error: err,
    });
    logger.error('Error during user registration', err);
  }
};

export default login;
