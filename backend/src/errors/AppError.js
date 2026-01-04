export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;

        // means that this error is expected to happen
        // such as user not found or not authorized
        this.isOperational = true;
    }
}