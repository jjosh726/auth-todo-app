
const taskLayout = document.querySelector('.js-task-layout');

function controlTaskSidebarState() {
    taskLayout.classList.toggle('is-closed');
}

document.querySelector('.js-close-task-button')
    .addEventListener('click', controlTaskSidebarState);

document.querySelector('.js-add-new-task')
    .addEventListener('click', controlTaskSidebarState);

document.querySelectorAll('.js-edit-task')
    .forEach(button => button.addEventListener('click', controlTaskSidebarState));
