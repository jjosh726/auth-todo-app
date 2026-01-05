import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        username : {
            type : String,
            required : true,
            unique : true,
            trim : true,
            maxLength : 50
        },
        email : {
            type : String,
            required : true,
            unique : true,
            trim : true,
            lowercase : true
        },
        password : {
            type : String,
            required : true,
            trim : true,
            minLength : 8,
            maxLength : 50
        }
    },
    {
        timestamps : true
    }
);

userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) return;
    
        this.password = await bcrypt.hash(this.password, 10);
    } catch (err) {
        throw err;
    }
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

export const User = mongoose.model("User", userSchema);