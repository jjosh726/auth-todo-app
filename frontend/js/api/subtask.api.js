import { displayPopup } from "../utils/popup.js";

export async function fetchUpdateSubtask(taskId, subtaskId, body) {
    const response = await fetch(`api/v1/task/${taskId}/subtask/${subtaskId}`, {
        method : "PUT",
        credentials : "include",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(body)
    });

    const data = await response.json();
    console.log('Updated subtask: ', data);

    if (!response.ok) {
        throw new Error( data.message || 'Failed to update subtask');
    }

    return data;
}

export async function fetchSubtask(taskId, subtaskId) {
    const response = await fetch(`api/v1/task/${taskId}/subtask/${subtaskId}`, {
        credentials : "include"
    });

    const data = await response.json();
    console.log("Subtask: ", data);

    if (!response.ok) {
        throw new Error( data.message || 'Failed to find subtask' );
    }

    return data;
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

export async function fetchDeleteSubtask(taskId, subtaskId) {
    const response = await fetch(`api/v1/task/${taskId}/subtask/${subtaskId}`, {
        method : "DELETE",
        credentials : "include"
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error( data.message || 'Failed to delete subtask');
    }

    return data;
}