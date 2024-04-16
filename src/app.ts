import express from 'express';
import mongoose from 'mongoose';
import cookie from 'cookie-parser';
import dotenv from 'dotenv';
import { CardRouter, UserRouter } from '@routes';
import { UserController } from '@controllers';
import {
  auth,
  createUserCelebrate,
  errorHandler,
  errorLogger,
  loginUserCelebrate,
  requestLogger,
} from '@middleware';
import { NotFoundError } from '@type/errors';

dotenv.config();

const { createUser, loginUser } = UserController;

const app = express();
const port = 3000;

mongoose.connect(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/mestodb`);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Ошибка БД:'));
db.once('open', () => {
  console.log('Подключено MongoDB!');
});

app.use(requestLogger);
app.use(cookie());
app.use(express.json());

app.post('/signin', loginUserCelebrate, loginUser);
app.post('/signup', createUserCelebrate, createUser);

app.use(auth);

app.use('/cards', CardRouter);
app.use('/users', UserRouter);

app.use((_req, _res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use(errorLogger);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`API работает на порту ${port}`);
});
