import mongoose, { Schema } from "mongoose";

const subtaskSchema = new Schema(
    {
        title : {
            type : String,
            required : true,
            trim : true,
            minLength : 1,
            maxLength : 250
        },
        completed : {
            type : Boolean,
            default : false
        },
        taskId : {
            type : Schema.Types.ObjectId,
            ref : 'Task',
            required : true
        }
    },
    {
        timestamps : true
    }
);