import { ListNotFoundError } from "../errors/NotFound.js";
import { List } from "../models/list.model.js";


const authorizeList = async (req, res, next) => {
    try {
        const { listId } = req.body;
        const userId = req.userId;

        // its fine if a task is not specifically attached to a list
        if (!listId) return next();

        const list = await List.findOne({ _id : listId, userId });

        if (!list) throw new ListNotFoundError();

        next();
    } catch (err) {
        next(err);
    }
}

export { authorizeList };