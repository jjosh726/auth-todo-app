import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { UserNotFoundError } from "../errors/NotFound.js";
import { AuthenticationError } from "../errors/AuthenticationError.js";
import { EmptyRequestError } from "../errors/EmptyError.js";

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

        if (!user) throw new UserNotFoundError();

        // compare password
        const isMatchPassword = await user.comparePassword(password);
        if (!isMatchPassword) throw new AuthenticationError();

        const token = jwt.sign(
            { userId : user._id },
            process.env.JWT_SECRET,
            { expiresIn : process.env.JWT_EXPIRATION}
        )

        const refreshToken = jwt.sign(
            { userId : user._id },
            process.env.REFRESH_SECRET,
            { expiresIn : process.env.REFRESH_EXPIRATION }
        )

        res.cookie("access_token", token, {
            httpOnly: true,
            secure : process.env.NODE_ENV === 'production',
            sameSite : "lax",
            path : "/",
            maxAge : 60 * 60 * 1000
        });

        res.cookie("refresh_token", refreshToken, {
            httpOnly : true,
            secure : process.env.NODE_ENV === 'production',
            sameSite : "lax",
            path : "/",
            maxAge : 1000 * 60 * 60 * 24 * 7
        });

        res.status(200).json({
            message : "User logged in successfully.",
        });

    } catch (err) {
        next(err);
    }
}

const logout = async (req, res, next) => {
    try {
        // clearcookie options must match the original cookie options
        res.clearCookie("access_token", { path : "/" });
        res.clearCookie("refresh_token", { path : "/" });

        res.status(200).json({ 
            message: "Logged out." 
        });
    } catch (err) {
        next(err);
    }
}

const me = async (req, res, next) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId);

        if (!user) throw new UserNotFoundError();

        res.status(200).json({
            message : "User found.",
            user : {
                id : user._id,
                username : user.username,
                email : user.email,
                createdAt : user.createdAt,
                updatedAt : user.updatedAt
            }
        })

    } catch (err) {
        next(err);
    }
}

const updateUser = async (req, res, next) => {
    try {
        const userId = req.userId;
        
        const allowedUpdates = ["username", "email"];
        const updates = {};

        for (const key of allowedUpdates) {
            if (req.body[key] !== undefined) {
                updates[key] = req.body[key];
            }
        }

        if (Object.keys(updates).length === 0) throw new EmptyRequestError();

        const updatedUser = await User.findByIdAndUpdate(userId, updates, {
            new : true
        });

        if (!updatedUser) throw new UserNotFoundError();

        return res.status(200).json({
            message : "User updated successfully",
            user : {
                id : updatedUser._id,
                username : updatedUser.username,
                email : updatedUser.email,
                createdAt : updatedUser.createdAt,
                updatedAt : updatedUser.updatedAt
            }
        })
        
    } catch (err) {
        next(err);
    }
}


export {
    register,
    login,
    logout,
    me,
    updateUser
}