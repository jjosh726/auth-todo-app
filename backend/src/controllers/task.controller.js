import { AuthorizationError } from "../errors/AuthorizationError.js";
import { EmptyRequestError, EmptyTitleError } from "../errors/EmptyError.js";
import { TaskNotFoundError } from "../errors/NotFound.js";
import { Task } from "../models/task.model.js";

const getTasks = async (req, res, next) => {
    try {
        const userId = req.userId;

        let tasksQuery = Task.find({ userId : userId });

        const { include } = req.query;
        if (include && include.includes("subtasks")) {
            tasksQuery = tasksQuery.populate({
                path : "subtasks"
            });
        }

        const tasks = await tasksQuery.exec();

        if (tasks.length === 0) return res.status(200).json({
            message : "Request successful. Tasks empty.",
            tasks
        })

        // console.log(tasks);

        res.status(200).json({
            message : "Request succesful.",
            tasks
        })

    } catch (err) {
        next(err);
    }
}

const getTaskById = async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const userId = req.userId;

        let taskQuery = Task.findById(taskId);

        const { include } = req.query;
        if (include && include.includes("subtasks")) {
            taskQuery = taskQuery.populate({
                path : "subtasks"
            });
        }

        const task = await taskQuery.exec();

        if (!task) throw new TaskNotFoundError();
        if (!task.userId.equals(userId)) throw new AuthorizationError();

        return res.status(200).json({
            message : "Task found successfully.",
            task
        })
    } catch (err) {
        next(err);
    }
}

const createTask = async (req, res, next) => {
    try {
        const { title, description, dueDate, listId} = req.body;

        const userId = req.userId;

        if (!title) throw new EmptyTitleError();

        // check if listId exists and check if the list is owned by the user

        const task = await Task.create({
            title, description, dueDate, userId, listId
        });


        return res.status(201).json({
            message: "Task successfully created.",
            task : {
                id : task._id,
                title : task.title,
                description : task.description,
                completed : task.completed,
                dueDate : task.dueDate,
                userId : task.userId,
                listId : task.listId,
                createdAt : task.createdAt,
                updatedAt : task.updatedAt
            }
            
        })

    } catch (err) {
        next(err);
    }
}

const updateTask = async (req, res, next) => {
    try {
        const allowedUpdates = ["title", "description", "listId", "completed", "dueDate"];
        const updates = {};

        for (const key of allowedUpdates) {
            if (req.body[key] !== undefined) {
                updates[key] = req.body[key];
            }
        }

        if (Object.keys(updates).length == 0) throw new EmptyRequestError();

        const userId = req.userId;
        const taskId = req.params.id;
        
        const task = await Task.findOneAndUpdate(
            { _id : taskId, userId }, 
            updates, 
            { new : true }
        );
        
        if (!task) throw new TaskNotFoundError();

        return res.status(200).json({
            message : "Task updated successfully.",
            task
        })

    } catch (err) {
        next(err);
    }
}

const deleteTask = async (req, res, next) => {
    try {
        const userId = req.userId;
        const taskId = req.params.id;

        const deleted = await Task.findOneAndDelete(
            { _id : taskId, userId }
        );
        
        if (!deleted) throw new TaskNotFoundError();

        return res.status(200).json({
            message : "Task deleted successfully."
        });

    } catch (err) {
        next(err);
    }
}

export {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
}