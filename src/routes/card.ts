import express from "express";
import { CardController } from "@controllers";
import {
  createCardCelebrate,
  deleteCardByIdCelebrate,
  likeCardCelebrate,
  unlikeCardCelebrate,
} from "@middleware";

const { getAllCards, createCard, deleteCardById, likeCard, unlikeCard } =
  CardController;

const router = express.Router();

router.get("/", getAllCards);
router.post("/", createCardCelebrate, createCard);
router.delete("/:cardId", deleteCardByIdCelebrate, deleteCardById);
router.put("/:cardId/likes", likeCardCelebrate, likeCard);
router.delete("/:cardId/likes", unlikeCardCelebrate, unlikeCard);

export { router };
