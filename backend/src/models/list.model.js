import mongoose, { Schema } from "mongoose";

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

export const List = mongoose.model("List", listSchema);