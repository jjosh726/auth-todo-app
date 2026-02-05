const passwordInput = document.querySelector('.js-password-input');
const emailInput = document.querySelector('.js-email-input');

const togglePasswordButton = document.querySelector('.js-toggle-password');

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

document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    const data = { email, password };
    
    // fetch (url, { method, headers, body })

    fetch('/api/v1/auth/login', 
        {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(data)
        }
    )
        .then(response => {            
            if (response.ok) {
                return response.json();
            } else {
                return response.json()
                    .then(err => {
                        throw new Error(err.message || 'Login Failed.');
                    })
            }
        })
        .then(data => {
            displayPopup(data.message, true);
            window.location.href = '/index.html';
        })
        .catch(error => {
            displayPopup(error.message, false);
            resetForm();
        })
})

function resetForm() {
    passwordInput.value = '';
    emailInput.value = '';
}

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
