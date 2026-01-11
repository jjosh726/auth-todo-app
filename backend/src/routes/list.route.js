import { Router } from "express";
import { verifyToken } from "../middlewares/authHandler.js";
import { createList, deleteList, getAllLists, getListById, updateList } from "../controllers/list.controller.js";

const listRouter = new Router();

listRouter.use(verifyToken);

// create list
listRouter.post('/', createList);

// get all list based on user
listRouter.get('/', getAllLists);

// get list by id
listRouter.get('/:id', getListById);

// update list name
listRouter.put('/:id', updateList);

// delete list
listRouter.delete('/:id', deleteList);

export default listRouter;