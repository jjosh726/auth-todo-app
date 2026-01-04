import { Router } from "express";
import { register, login, logout } from "../controllers/user.controller.js";

const userRouter = new Router();

userRouter.post('/register', register);
userRouter.post('/login', login);

export default userRouter;