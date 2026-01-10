import { AppError } from "./AppError.js";

export class EmptyTitleError extends AppError {
    constructor() {
        super("Title field required.", 400);
    }
}

export class EmptyRequestError extends AppError {
    constructor() {
        super("At least one field is required.", 400);
    }
}