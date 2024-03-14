import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import { UserModel, IUser } from '@models';
import {
  NotFoundError,
  UnauthorizedError,
} from '@type/errors';

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req.params;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: IUser = new UserModel({
      name,
      about,
      avatar,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const { password: hashedPwd, ...userWithoutPwd } = newUser.toObject();

    res.status(201).json(userWithoutPwd);
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, about } = req.body;
  const userId = req.user?._id;

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { name, about },
      { runValidators: true, new: true },
    );

    if (!updatedUser) {
      throw new NotFoundError('User not found');
    }

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const updateUserAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { avatar } = req.body;
  const userId = req.user?._id;

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { avatar },
      { runValidators: true, new: true },
    );

    if (!updatedUser) {
      throw new NotFoundError('User not found');
    }

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?._id;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedError('Incorrect email or password');
    }

    const token = jwt.sign({ _id: user._id }, 'secret-key', {
      expiresIn: '1w',
    });

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    next(error);
  }
};
