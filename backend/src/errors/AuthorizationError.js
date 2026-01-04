import { AppError } from "./AppError";

export class AuthorizationError extends AppError {
    constructor() {
        super("Access denied.", 401);
    }
}


export class ServerAuthError extends AppError {
    constructor() {
        super("Authorization failed. Please try again.", 500);
    }
}