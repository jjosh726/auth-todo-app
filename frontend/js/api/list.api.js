import { displayPopup } from "../utils/popup.js";

export async function fetchUserLists() {
    try {
        const response = await fetch('api/v1/list/?include=count', { credentials : 'include' });

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

