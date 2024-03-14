import { Schema, Document, model } from 'mongoose';
import { IUser } from './user';

interface ICard extends Document {
  name: string;
  link: string;
  owner: IUser['_id'];
  likes: IUser['_id'][];
  createdAt: Date;
}

const cardSchema = new Schema<ICard>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  likes: { type: [Schema.Types.ObjectId], default: [] },
  createdAt: { type: Date, default: Date.now() },
});

const Card = model<ICard>('card', cardSchema);

export { Card, ICard };
