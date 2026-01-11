import { TaskNotFoundError } from "../errors/NotFound.js";
import { Task } from "../models/task.model.js";

const authorizeTask = async (req, res, next) => {
    try {
        const taskId = req.params.taskId;
        const userId = req.userId;

        const task = await findOne({ _id : taskId, userId });

        if (!task) throw new TaskNotFoundError();

        next();

    } catch (err) {
        next(err);
    }
}

export { authorizeTask };