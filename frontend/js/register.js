import { registerUser } from "./api/auth.api.js";

const usernameInput = document.querySelector('.js-username-input');
const emailInput = document.querySelector('.js-email-input');
const passwordInput = document.querySelector('.js-password-input');
const confirmPasswordInput = document.querySelector('.js-confirm-password-input');

const togglePasswordButton = document.querySelector('.js-toggle-password');

const popup = document.querySelector('.js-popup');

togglePasswordButton.addEventListener('click', () => {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';

        document.querySelector('.js-visible-password').style.display = "none";
        document.querySelector('.js-invisible-password').style.display = "block";
    } else {
        passwordInput.type = 'password';

        document.querySelector('.js-visible-password').style.display = "block";
        document.querySelector('.js-invisible-password').style.display = "none";
    }
})

const passwordRequirements = {
    '.lowercase' : /[a-z]/g,
    '.uppercase' : /[A-Z]/g,
    '.number' : /[0-9]/g
}

passwordInput.onkeyup = validatePassword;

function validatePassword () {
    const password = passwordInput.value;
    let validPassword = true;

    for (const key of Object.keys(passwordRequirements)) {
        if (!password.match(passwordRequirements[key])) {
            document.querySelector(key).classList.add('is-visible');
            validPassword = false;
        } else {
            document.querySelector(key).classList.remove('is-visible');
        }
    }

    if (password.length < 8) {
        document.querySelector('.characters').classList.add('is-visible');
        validPassword = false;
    } else {
        document.querySelector('.characters').classList.remove('is-visible');
    }

    return validPassword;
}

document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = usernameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    const body = { username, email, password };

    try {
        if (password !== confirmPassword) 
            throw new Error('Confirm password not the same.');
        
        if (!validatePassword())
            throw new Error('Invalid password.')

        await registerUser(body);
        window.location.href = '/login.html';

    } catch (error) {
        displayPopup(error.message, false);
        resetForm();
    } 
    
    // fetch (url, { method, headers, body })

    // fetch('/api/v1/auth/login', 
    //     {
    //         method : "POST",
    //         headers : {
    //             "Content-Type" : "application/json"
    //         },
    //         body : JSON.stringify(data)
    //     }
    // )
    //     .then(response => {            
    //         if (response.ok) {
    //             return response.json();
    //         } else {
    //             return response.json()
    //                 .then(err => {
    //                     throw new Error(err.message || 'Login Failed.');
    //                 })
    //         }
    //     })
    //     .then(data => {
    //         displayPopup(data.message, true);
    //         window.location.href = '/index.html';
    //     })
    //     .catch(error => {
    //         displayPopup(error.message, false);
    //         resetForm();
    //     })
})

function resetForm() {
    usernameInput.value = '';
    passwordInput.value = '';
    confirmPasswordInput.value = '';
    emailInput.value = '';
}

function displayPopup(errorMsg, success) {
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