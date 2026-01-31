import { displayPopup } from "../utils/popup.js";

export async function fetchUserTasks() {
    try {
        const response = await fetch('api/v1/task/?include=subtasks', { credentials : 'include' });

        if (response.ok) {
            const data = await response.json();
            console.log("User tasks:", data);

            return data;
        } else {
            const error = await response.json();
            throw new Error( error.message );
        }

        throw new Error('An error occured. Please try again later.');

    } catch (error) {
        displayPopup(error.message, false);
    }
}

export async function fetchTask(taskId) {
    try {
        const response = await fetch(`api/v1/task/${taskId}?include=subtasks`, { credentials : 'include' });

        if (response.ok) {
            const data = await response.json();
            console.log("Current task:", data);

            return data;
        } else {
            const error = await response.json();
            throw new Error( error.message );
        }

        throw new Error('An error occured. Please try again later.');

    } catch (error) {
        displayPopup(error.message, false);
    }
}

export async function fetchCreateTask(body) {
    const response = await fetch(`api/v1/task/`,
        {
            method : "POST",
            credentials : "include",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(body)
        }
    );

    const data = await response.json();
    console.log("New task:", data);

    if (!response.ok) {
        throw new Error( data.message || 'Failed to create Task' );
    }

    return data;
}

export async function fetchDeleteTask(taskId) {
    const response = await fetch(`api/v1/task/${taskId}`,
        {
            method : "DELETE",
            credentials : "include"
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error( data.message || 'Failed to delete task' );
    }

    return data;
}