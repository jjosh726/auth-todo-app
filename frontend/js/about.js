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


// 3. Start observing
document.querySelectorAll('img.lazy-load')
    .forEach(image => {
        const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log('Image has entered the screen!');

                const className = parseClassName(entry.target.className);
                document.querySelector(className).classList.add('img-appear');
                
                // Stop observing after it enters
                observer.unobserve(entry.target); 
            }
        });
        }, {
            threshold: 0.8 // Trigger when 10% of the image is visible
        });

        observer.observe(image);
    })

function parseClassName(className) {
    return className
        .split(' ')
        .map(t => "." + t)
        .join('');
    
}
