import express from "express";
import { UserController } from "@controllers";
import {
  getUserByIdCelebrate,
  updateUserAvatarCelebrate,
  updateUserProfileCelebrate,
} from "middleware/validation";

const {
  getAllUsers,
  getUserById,
  updateUserAvatar,
  updateUserProfile,
  getUserProfile,
} = UserController;

const router = express.Router();

router.get("/", getAllUsers);
router.get("/me", getUserProfile);
router.get("/:userId", getUserByIdCelebrate, getUserById);
router.patch("/me", updateUserProfileCelebrate, updateUserProfile);
router.patch("/me/avatar", updateUserAvatarCelebrate, updateUserAvatar);

export { router };
