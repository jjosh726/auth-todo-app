import { displayPopup } from "./utils/popup.js";

async function init() {
    try {
        const { user } = await fetchUserInfo();

        updateUserInfo(user);

        if (!user) window.location.href = '/login.html';
    } catch (error) {
        if (error.status === 401 ) {
            // replace prevents back-navigation
            window.location.replace('/login.html');
            return;
        }

        displayPopup(error.message, false);
    }
}

init();

const userLink = document.querySelector('.js-user-link');
const loginLink = document.querySelector('.js-login-link');


function updateUserInfo(user) {
    userLink.classList.toggle('is-invisible');
    loginLink.classList.toggle('is-invisible');

    userLink.innerHTML = user.username;

    document.title = `${user.username} - TaskTon`
}
