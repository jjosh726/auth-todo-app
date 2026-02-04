import mongoose, { Schema } from "mongoose";
import { TaskNotFoundError } from "../errors/NotFound.js";
import { Subtask } from "./subtask.model.js";


const taskSchema = new Schema(
    {
        title : {
            type : String,
            required : true,
            trim : true,
            minLength : 1,
            maxLength : 250
        },
        description : {
            type : String,
            // required : function () { return this.description !== null; },
            trim : true,
            minLength : 1,
            maxLength : 2500
        },
        completed : {
            type : Boolean,
            default : false
        },
        dueDate : {
            type : Date
        },
        userId : {
            type : Schema.Types.ObjectId,
            ref : 'User',
            required : true
        },
        listId : {
            type : Schema.Types.ObjectId,
            ref : 'List'
        }
    }, {
        timestamps : true
    }
);


// cascade delete subtasks when task is deleted
taskSchema.pre("findOneAndDelete", async function (next) {
    try {
        const task = await this.model.find(this.getFilter());
        if (!task) throw new TaskNotFoundError();
        
        await Subtask.deleteMany({ taskId : Task._id });

    } catch (err) {
        throw err;
    }
})

// SUBTASKS VIRTUAL

// virtuals are only serialized using populate, 
// otherwise querying the database will not return the
// virtual fields by default

// When you `populate()` the `subtask` virtual, Mongoose will find the
// documents in the Subtask model whose `taskId` matches this document's
// `_Id` property.

taskSchema.virtual('subtasks', {
    ref : 'Subtask',
    localField : '_id',
    foreignField : 'taskId'
});

// allow virtuals to become JSON objects and not kept as mongoose objects
taskSchema.set('toJSON', { virtuals : true });
taskSchema.set('toObject', { virtuals : true });

export const Task = mongoose.model("Task", taskSchema);