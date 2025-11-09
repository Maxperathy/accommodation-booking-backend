/**
 * Node modules
 */
import { Model, Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser {
  fullname: string;
  email: string;
  password: string;
}

export interface IUserMethods {
  isPasswordValid(password: string): Promise<boolean>;
}

//User Schema
const userSchema = new Schema<IUser, Model<IUser, {}, IUserMethods>>({
  fullname: {
    type: String,
    required: [true, 'Fullname is required'],
    maxLength: [100, 'Fullname is too long'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    maxLength: [50, 'Email must be less than 50 characters'],
    unique: [true, 'Email must be unique'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordValid = async function (
  password: string,
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

export const User = model<IUser, Model<IUser, {}, IUserMethods>>(
  'User',
  userSchema,
);
