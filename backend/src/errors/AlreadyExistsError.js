import { AppError } from "./AppError.js";

export class ListAlreadyExistsError extends AppError {
    constructor() {
        super("List name already exists.", 401);
    }
}