import { AppError } from "./AppError";

export class AuthenticationError extends AppError {
    constructor() {
        super("Invalid Credentials.", 401);
    }
}