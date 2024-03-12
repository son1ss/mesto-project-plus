import express from "express";
import mongoose from "mongoose";
import cookie from "cookie-parser";
import { CardRouter, UserRouter } from "@routes";
import { UserController } from "@controllers";
import {
  auth,
  createUserCelebrate,
  errorHandler,
  errorLogger,
  loginUserCelebrate,
  requestLogger,
} from "@middleware";

const { createUser, loginUser } = UserController;

const app = express();
const port = 3000;

mongoose.connect("mongodb://127.0.0.1:27017/mestodb");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Ошибка БД:"));
db.once("open", () => {
  console.log("Подключено MongoDB!");
});

app.use(requestLogger);
app.use(cookie());
app.use(express.json());

app.post("/signin", loginUserCelebrate, loginUser);
app.post("/signup", createUserCelebrate, createUser);

app.use(auth);

app.use("/cards", CardRouter);
app.use("/users", UserRouter);

app.use(errorLogger);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`API работает на порту ${port}`);
});
