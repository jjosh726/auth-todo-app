import { AppError } from "../errors/AppError.js";

export const errorHandler = (err, req, res, next) => {
    // handle custom defined errors
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            message : err.message
        })
    }

    // mongoose validation error 
    if (err.name === "ValidationError") {
        let messages = [];

        Object.keys(err.errors).forEach(key => {
            messages.push(err.errors[key].message);
        })

        return res.status(400).json({ messages });
    }

    // duplicate values (for example : duplicate email found)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({
            message : `${field} already exists.`
        });
    }

    // handling JWT errors
    if (err.name === 'TokenExpiredError') return res.status(401).json({
        message : "Token Expired. Please try again."
    })

    if (err.name === 'JsonWebTokenError') return res.status(401).json({
        message : "Invalid token. Please log in again."
    })

    if (err.name === 'NotBeforeError') return res.status(401).json({
        message : "Token not yet activated. Please try again later."
    })

    // default server error
    return res.status(500).json({
        message : "Internal server error. Please try again later.",
        err : err.message
    });
}