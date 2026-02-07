import { fetchUserInfo, updateUser } from "./api/auth.api.js";

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
    document.title = `${user.username} - TaskTon Settings`;

    document.querySelector('.js-username-input').value = user.username;
    document.querySelector('.js-email-input').value = user.email;

    userLink.classList.toggle('is-invisible');
    loginLink.classList.toggle('is-invisible');
    
    userLink.innerHTML = user.username;
}

document.querySelector('form')
    .addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.querySelector('.js-username-input').value;
        const email = document.querySelector('.js-email-input').value;

        try {
            let { user } = await fetchUserInfo();

            let body = { username, email };

            if (user.username === username) delete body.username;
            if (user.email === email) delete body.email;

            if (Object.keys(body).length === 0)
                throw new Error('No values were changed. Please try again.');
            
            let newUserInfo = await updateUser(body);
            
            displayPopup(newUserInfo.message, true);
            user = newUserInfo.user;

            document.title = `${user.username} - TaskTon Settings`;

            document.querySelector('.js-username-input').value = user.username;
            document.querySelector('.js-email-input').value = user.email;
            
            userLink.innerHTML = user.username;

        } catch (error) {
            displayPopup(error.message, false);
        }
    })


const popup = document.querySelector('.js-popup');

export function displayPopup(errorMsg, success) {
    if (!popup) return;
    popup.style.display = 'block';
    popup.innerHTML = errorMsg;

    if (success) {
        popup.classList.add('success');
        popup.classList.remove('danger');
    } else {
        popup.classList.add('danger');
        popup.classList.remove('success');
    }

    setTimeout(() => {
        popup.style.display = 'none';
    }, 2000);
}