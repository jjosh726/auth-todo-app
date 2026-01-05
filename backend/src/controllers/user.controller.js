import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { UserNotFoundError } from "../errors/userNotFound.js";
import { AuthenticationError } from "../errors/AuthenticationError.js";

const register = async (req, res, next) => {
    try {
        const {email} = req.body;
        
        let existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({
            message : "User already exists."
        })

        const user = await User.create(req.body);

        return res.status(201).json({ 
            message : "User successfully created.",
            user : {
                id : user._id,
                username : user.username,
                email : user.email,
                createdAt : user.createdAt,
                updatedAt : user.updatedAt
            }
        });

    } catch (err) {
        next(err);
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) throw new AuthenticationError();

        // find user by email
        const user = await User.findOne({ email : email.toLowerCase() });

        console.log(user);

        if (!user) throw new UserNotFoundError();

        // compare password
        const isMatchPassword = await user.comparePassword(password);
        if (!isMatchPassword) throw new AuthenticationError();

        const token = jwt.sign(
            { userId : user._id },
            process.env.JWT_SECRET,
            { expiresIn : process.env.JWT_EXPIRATION}
        )

        res.status(200).json({
            message : "User logged in successfully.",
            token 
        });

    } catch (err) {
        next(err);
    }
}


export {
    register,
    login
}