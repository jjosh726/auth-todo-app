import { AppError } from "./AppError.js";

export class UserNotFoundError extends AppError {
    constructor() {
        super("User not found.", 404);
    }
}

export class TaskNotFoundError extends AppError {
    constructor() {
        super("Task not found.", 404);
    }
}

export class SubtaskNotFoundError extends AppError {
    constructor() {
        super("Subtask not found.", 404);
    }
}


export class ListNotFoundError extends AppError {
    constructor() {
        super("List not found.", 404);
    }
}