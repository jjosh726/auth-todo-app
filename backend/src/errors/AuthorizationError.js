import { AppError } from "./AppError.js";

export class AuthorizationError extends AppError {
    constructor() {
        super("Access denied.", 403);
    }
}


export class ServerAuthError extends AppError {
    constructor() {
        super("Authorization failed. Please try again.", 500);
    }
}