import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { UserNotFoundError } from "../errors/userNotFound.js";

const register = async (req, res, next) => {
    try {
        const user = await User.create(req.body);
        return res.status(201).json({ message : "User successfully created."});
    } catch (error) {
        next(err);
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // find user by email
        const user = await User.findOne({ email : email.toLowerCase() });

        if (!user) throw new UserNotFoundError();

        // compare password
        const isMatchPassword = await user.comparePassword(password);
        if (!isMatchPassword) throw new AuthenticationError();

        const token = jwt.sign(
            { userId : user._id },
            process.env.JWT_SECRET,
            process.env.JWT_EXPIRATION
        )

        res.status(200).json({ token });

    } catch (error) {
        next(err);
    }
}


export {
    register,
    login
}