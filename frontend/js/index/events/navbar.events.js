import { logout } from "../../api/auth.api.js";
import { displayPopup } from "../../utils/popup.js";

const userLink = document.querySelector('.js-user-link');
const extraUserLinks = document.querySelector('.js-user-link-hover');

let isDropdown = false;
let isHoveringLinks = false;

userLink.addEventListener('mouseenter', () => {
    isDropdown = true;
    displayUserLinks();
})

userLink.addEventListener('mouseleave', () => {
    isDropdown = false;
    displayUserLinks();
})

extraUserLinks.addEventListener('mouseenter', () => {
    isHoveringLinks = true;
    displayUserLinks();
})

extraUserLinks.addEventListener('mouseleave', () => {
    isHoveringLinks = false;
    displayUserLinks();
})

function displayUserLinks () {
    if (isDropdown || isHoveringLinks) {
        if (!extraUserLinks.classList.contains('is-visible'))
            extraUserLinks.classList.add('is-visible');
    } else {
        if (extraUserLinks.classList.contains('is-visible'))
            extraUserLinks.classList.remove('is-visible');
    }
}

document.querySelector('.js-logout')
    .addEventListener('click', async (e) => {
        e.preventDefault();

        try {
            await logout();
            window.location.href = '/login.html';
        } catch (error) {
            displayPopup(error.message, false);
        }
    })