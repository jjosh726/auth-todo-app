import mongoose, { Schema } from "mongoose";
import { ListNotFoundError } from "../errors/NotFound.js";
import { Task } from "./task.model.js";

const listSchema = new Schema(
    {
        name : {
            type : String,
            required : true,
            trim : true,
            minLength : 1,
            maxLength : 20
        },
        userId : {
            type : Schema.Types.ObjectId,
            ref : 'User',
            required : true
        }
    },
    {
        timestamps : true
    }
);

// cascade delete tasks when list is deleted
listSchema.pre("findOneAndDelete", async function (next) {
    try {
        const list = await this.model.findOne(this.getFilter());
        if (!list) throw new ListNotFoundError();

        const tasks = await Task.find({ listId : this._id }).select("_id");

        // trigger findOneAndDelete middleware in Task model
        for (const task of tasks) {
            await Task.findOneAndDelete({ _id : task._id });
        }
    } catch (err) {
        throw err;
    }
});

// TASKS VIRTUAL

listSchema.virtual('tasks', {
    ref : 'Task',
    localField : '_id',
    foreignField : 'listId'
});

listSchema.set('toJSON', { virtuals : true });
listSchema.set('toObject', { virtuals : true });

export const List = mongoose.model("List", listSchema);