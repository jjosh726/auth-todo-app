import { AppError } from "./AppError.js";

export class AuthenticationError extends AppError {
    constructor() {
        super("Invalid credentials.", 401);
    }
}