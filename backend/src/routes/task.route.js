import { Router } from "express";
import { verifyToken } from "../middlewares/authHandler.js";
import { createTask, deleteTask, getTaskById, getTasks, updateTask } from "../controllers/task.controller.js";
import { authorizeList } from "../middlewares/listAuthHandler.js";

const taskRouter = new Router();

// all routes with /:id should have ownership checks
// must belong to user
// token verification for all routes
taskRouter.use(verifyToken);

// GET all tasks from user
taskRouter.get('/', getTasks);

// GET task by ID
taskRouter.get('/:id', getTaskById)

// POST create new task
taskRouter.post('/', authorizeList, createTask);

// PUT change task by id
taskRouter.put('/:id', authorizeList, updateTask);

// DELETE a task by id
taskRouter.delete('/:id', authorizeList, deleteTask);

// PUT -> CHANGE ENTIRE RESOURCE
// PATCH -> UPDATE PART OF RESOURCE

export default taskRouter;