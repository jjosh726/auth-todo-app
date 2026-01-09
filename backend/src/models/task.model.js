import mongoose, { Schema } from "mongoose";

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
            required : true,
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

export const Task = mongoose.model("Task", taskSchema);