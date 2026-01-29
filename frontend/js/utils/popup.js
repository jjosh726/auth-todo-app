const popup = document.querySelector('.js-popup');

export function displayPopup(errorMsg, success) {
    popup.style.display = 'block';
    popup.innerHTML = errorMsg;

    if (success) {
        popup.classList.add('success');
        popup.classList.remove('danger');
    } else {
        popup.classList.add('danger');
        popup.classList.remove('success');
    }
}
