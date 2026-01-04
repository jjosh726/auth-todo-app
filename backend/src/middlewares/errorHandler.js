import { AppError } from "../errors/AppError";

export const errorHandler = (err, req, res, next) => {
    // handle custom defined errors
    if (err instanceof AppError) {
        return res.statusCode(err.statusCode).json({
            message : err.message
        })
    }

    if (err.name === "ValidationError") {
        let errors = {};

        Object.keys(err.errors).forEach(key => {
            errors[key] = err.errors[key].message;
        })

        return res.status(400).json({ errors });
    }

    // duplicate values (for example : duplicate email found)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({
            message : `${field} already exists.`
        });
    }

    return res.status(500).json({
        message : "Internal server error. Please try again later.",
        error
    });
}