import { EmptyRequestError } from "../errors/EmptyError.js";
import { ListNotFoundError } from "../errors/NotFound.js";
import { List } from "../models/list.model.js";

// create list
const createList = async (req, res, next) => {
    try {
        const userId = req.userId;
        const { name } = req.body;

        if (!name) throw new EmptyRequestError();

        const list = await List.create({
            name,
            userId
        });

        return res.status(201).json({
            message : "List created successfully.",
            list : {
                id : list._id,
                name : list.name,
                userId : list.userId,
                createdAt : list.createdAt,
                updatedAt : list.updatedAt
            }
        })

    } catch (err) {
        next(err);
    }
}

// get all list based on user
const getAllLists = async (req, res, next) => {
    try {
        const userId = req.userId;

        const lists = await List.find({ userId });
        
        return res.status(200).json({
            message : "Request successful.",
            lists
        });
        
    } catch (err) {
        next(err);
    }
}

// get list by id
const getListById = async (req, res, next) => {
    try {
        const listId = req.params.id;
        const userId = req.userId;

        const list = await List.findOne({
            _id : listId,
            userId
        });

        if (!list) throw new ListNotFoundError();

        return res.status(200).json({
            message : "List found successfully.",
            list
        });

    } catch (err) {
        next(err);
    }
}

// update list name
const updateList = async (req, res, next) => {
    try {
        const { name } = req.body;

        if (!name) throw new EmptyRequestError();

        const userId = req.userId;
        const listId = req.params.id;

        const list = await List.findOneAndUpdate(
            { _id : listId, userId },
            { name },
            { new : true }
        );

        if (!list) throw new ListNotFoundError();

        return res.status(200).json({
            message : "List updated successfully.",
            list
        });

    } catch (err) {
        next(err);
    }
}

// delete list
const deleteList = async (req, res, next) => {
    try {
        const userId = req.userId;
        const listId = req.params.id;

        const deleted = await List.findOneAndDelete({
            _id : listId,
            userId
        });

        if (!deleted) throw new ListNotFoundError();

        return res.status(200).json({
            message : "List deleted successfully."
        });

    } catch (err) {
        next(err);
    }
}

export {
    getAllLists,
    getListById,
    createList,
    updateList,
    deleteList
}