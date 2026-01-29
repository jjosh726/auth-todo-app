import { displayPopup } from "../utils/popup.js";

export async function fetchUserTasks() {
    try {
        const response = await fetch('api/v1/task/?include=subtasks', { credentials : 'include' });

        if (response.ok) {
            const data = await response.json();
            console.log(data);

            return data;
        } else {
            const error = await response.json();
            throw new Error( error.message || 'Not Logged In.');
        }

    } catch (error) {
        displayPopup(error.message, false);
    }
}

export async function fetchTask(taskId) {
    try {
        const response = await fetch(`api/v1/task/${taskId}?include=subtasks`, { credentials : 'include' });

        if (response.ok) {
            const data = await response.json();
            console.log(data);

            return data;
        } else {
            const error = await response.json();
            throw new Error( error.message || 'Task not found.' );
        }

    } catch (error) {
        displayPopup(error.message, false);
    }
}
