import { Router } from "express";
import { register, login, me } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/authHandler.js";

const userRouter = new Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/me', verifyToken, me);

export default userRouter;