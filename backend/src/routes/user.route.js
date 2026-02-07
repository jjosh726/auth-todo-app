import { Router } from "express";
import { register, login, me, logout, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/authHandler.js";

const userRouter = new Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.post('/logout', verifyToken, logout);
userRouter.get('/me', verifyToken, me);
userRouter.put('/update', verifyToken, updateUser);

export default userRouter;