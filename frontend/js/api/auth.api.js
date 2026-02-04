import { displayPopup } from "../utils/popup.js";

export async function fetchUserInfo() {
    try {
        const response = await fetch('/api/v1/auth/me');

        if (response.ok) {
            const data = await response.json();

            return data;
        } else {
            const error = await response.json();
            throw new Error( error.message || 'Not Logged In.');
        }
    } catch (error) {
        displayPopup(error.message, false);
        window.location.href = '/login.html';
    }
}
