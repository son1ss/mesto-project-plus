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
    type: String, required: true, minlength: 2, maxlength: 30,
  },
  about: {
    type: String, required: true, minlength: 2, maxlength: 200,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => validator.isURL(value),
      message: '{VALUE} is not a valid URL',
    },
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
