import { EmptyRequestError } from "../errors/EmptyError.js";
import { SubtaskNotFoundError } from "../errors/NotFound.js";
import { Subtask } from "../models/subtask.model.js";

// POST create new subtask
const createSubtask = async (req, res, next) => {
    try {
        if (!req.body) throw new EmptyRequestError();

        const { title } = req.body;
        const taskId = req.params.taskId;

        if (!title || !taskId) throw new EmptyRequestError();

        const subtask = await Subtask.create({
            title, taskId
        });

        return res.status(201).json({
            message : "Subtask successfully created.",
            subtask : {
                id : subtask._id,
                title : subtask.title,
                completed : subtask.completed,
                taskId : subtask.taskId,
                createdAt : subtask.createdAt,
                updatedAt : subtask.updatedAt
            }
        })

    } catch (err) {
        next(err);
    }
}

// GET all subtasks for a task
const getAllSubtasksForTask = async (req, res, next) => {
    try {
        const taskId = req.params.taskId;

        const subtasks = await Subtask.find({ taskId });
        
        return res.status(200).json({
            message : "Succesfully retrieved subtasks.",
            subtasks
        });

    } catch (err) {
        next(err);
    }
}

// GET specific subtask
const getSubtask = async (req, res, next) => {
    try {
        const { taskId, subtaskId } = req.params;

        const subtask = await Subtask.findOne({ _id : subtaskId, taskId });

        if (!subtask) throw new SubtaskNotFoundError();

        return res.status(200).json({
            message : "Successfully retrieved subtask.",
            subtask
        });

    } catch (err) {
        next(err);
    }
}

// PUT update specific subtask
const updateSubtask = async (req, res, next) => {
    try {
        const { taskId, subtaskId } = req.params;

        const allowedUpdates = ["title", "completed"];
        const updates = {};

        for (const key of allowedUpdates) {
            if (req.body[key] !== undefined) {
                updates[key] = req.body[key];
            }
        }

        if (Object.keys(updates).length === 0) throw new EmptyRequestError();

        const updatedSubtask = await Subtask.findOneAndUpdate({
           _id : subtaskId,
           taskId 
        }, updates, { new : true});

        if (!updatedSubtask) throw new SubtaskNotFoundError();

        return res.status(200).json({
            message : "Subtask updated succefully.",
            subtask : updatedSubtask
        })

    } catch (err) {
        next(err);
    }
}

// DELETE subtask
const deleteSubtask = async (req, res, next) => {
    try {
        const { taskId, subtaskId } = req.params;

        const deleted = await Subtask.findOneAndDelete({
            _id : subtaskId,
            taskId
        });

        if (!deleted) throw new SubtaskNotFoundError();

        return res.status(200).json({
            message : "Subtask deleted successfully."
        });

    } catch (err) {
        next(err);
    }
}

export {
    createSubtask,
    getAllSubtasksForTask,
    getSubtask,
    updateSubtask,
    deleteSubtask
}