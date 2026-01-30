import { displayPopup } from "../utils/popup.js";

export async function updateSubtaskCompletion(subtaskId) {
    try {
        // const response = await fetch(``)
    } catch (error) {
        displayPopup(error.message)
    }
}

export async function fetchCreateSubtask(taskId, body) {
    const response = await fetch(`api/v1/task/${taskId}/subtask/`,
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
    console.log("New Subtask:", data);

    if (!response.ok) {
        throw new Error( data.message || 'Failed to create subtask.');
    }

    return data;
}