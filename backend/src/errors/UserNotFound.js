import { AppError } from "./AppError.js";

export class UserNotFoundError extends AppError {
    constructor() {
        super("User not found.", 404);
    }
}