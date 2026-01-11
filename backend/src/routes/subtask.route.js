import { Router } from "express";
import { 
    createSubtask, 
    deleteSubtask, 
    getAllSubtasksForTask, 
    getSubtask, 
    updateSubtask 
} from "../controllers/subtask.controller.js";
import { verifyToken } from "../middlewares/authHandler.js";
import { authorizeTask } from "../middlewares/taskAuthHandler.js";

const subtaskRouter = new Router();

subtaskRouter.use(verifyToken, authorizeTask);

// POST create new subtask
subtaskRouter.post('', createSubtask);

// GET all subtasks for a task
subtaskRouter.get('', getAllSubtasksForTask);

// GET specific subtask
subtaskRouter.get('/:subtaskId', getSubtask);

// PUT update specific subtask
subtaskRouter.put('/:subtaskId', updateSubtask);

// DELETE subtask
subtaskRouter.delete('/:subtaskId', deleteSubtask);

export default subtaskRouter;