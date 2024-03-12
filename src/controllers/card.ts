import { Request, Response, NextFunction } from "express";
import { CardModel, ICard } from "@models";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "@type/errors";

export const getAllCards = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cards = await CardModel.find();
    res.json(cards);
  } catch (error) {
    next(new Error("Failed to retrieve cards"));
  }
};

export const createCard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, link } = req.body;
  const ownerId = req.user?._id;

  try {
    if (!name || !link) {
      throw new BadRequestError("Name and link are required");
    }

    const newCard: ICard = new CardModel({
      name,
      link,
      owner: ownerId,
    });

    await newCard.save();
    res.status(201).json(newCard);
  } catch (error) {
    next(error || new Error("Failed to create card"));
  }
};

export const deleteCardById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { cardId } = req.params;
  const userId = req.user?._id;

  try {
    const card = await CardModel.findById(cardId);

    if (!card) {
      throw new NotFoundError("Card not found");
    }

    if (card.owner.toString() !== userId) {
      throw new UnauthorizedError("You are not authorized to delete this card");
    }

    const deletedCard = await CardModel.findByIdAndDelete(cardId);

    res.json({ message: "Card deleted successfully", deletedCard });
  } catch (error) {
    next(error);
  }
};

export const likeCard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?._id;

  try {
    const likedCard = await CardModel.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: userId } },
      { new: true }
    );

    if (!likedCard) {
      throw new NotFoundError("Card not found");
    }

    res.json(likedCard);
  } catch (error) {
    next(error);
  }
};

export const unlikeCard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?._id;

  try {
    const unlikedCard = await CardModel.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: userId } },
      { new: true }
    );

    if (!unlikedCard) {
      throw new NotFoundError("Card not found");
    }

    res.json(unlikedCard);
  } catch (error) {
    next(error);
  }
};
