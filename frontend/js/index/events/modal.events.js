import { closeModal, createList, deleteList, deleteTask } from "../../utils/popup.js";

// MODAL DOM EVENTS
const deleteTaskBtn = document.querySelector('.js-delete-task-modal');
const deleteListBtn = document.querySelector('.js-delete-list-modal');

deleteTaskBtn.addEventListener('click', () => {
    deleteTask(deleteTaskBtn);
});

deleteListBtn.addEventListener('click', () => {
    deleteList(deleteListBtn);
});

document.querySelectorAll('.js-cancel-delete-modal')
    .forEach(button => button.addEventListener('click', closeModal))

document.querySelector('.js-create-list')
    .addEventListener('click', (e) => {
        e.preventDefault();

        createList();
    });