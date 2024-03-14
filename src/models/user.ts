import { Schema, Document, model } from 'mongoose';
import validator from 'validator';

interface IUser extends Document {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто', // Значение по умолчанию для поля name
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь', // Значение по умолчанию для поля about
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => validator.isURL(value),
      message: '{VALUE} is not a valid URL',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: '{VALUE} is not a valid email',
    },
  },
  password: { type: String, required: true, select: false },
});

const User = model<IUser>('user', userSchema);

export { User, IUser };
